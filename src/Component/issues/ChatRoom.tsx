import {withTranslation} from "react-i18next";
import {withRouter} from "react-router";
import MessageEditor from "./element/MessageEditor";
import MessageContainer from "./element/MessageContainer";
import {createRef, useEffect, useState} from "react";
import {ChatSocket} from "./ChatSocket";
import {Button, Col, Result, Row} from "antd";
import "./ChatRoom.css"
import {useSelector} from "react-redux";
import tApi from "./t-api";
import MemberList from "./element/MemberList";
import moment from "moment";

type Message = "send" | "receive"

interface SingleMessage {
    mg_id: number;
    content: string;
    from: string;
    from_email: string;
    m_gmt_create: string;
    type: Message;
}

interface MemberInfo {
    memberName: string;
    email: string;
}

interface GroupInfo{
    mg_id:number;
    members:MemberInfo[];
    builder:string;
    is_read:number;
    lastMID:number;
    lastTime:string;
}

export function copyMap(data: any) {
    let temp = new Map()
    for (let key of data.keys()) {
        temp.set(key, data.get(key));
    }
    return temp;
}

const ChatRoom = (props: any) => {
    const [mode, setMode] = useState(true);
    const [loading, setLoading] = useState(false);
    const [msgs, setMsgs] = useState<Map<string, SingleMessage[]>>(new Map());
    const [groupList, setGroupList] = useState<Map<string, GroupInfo>>(new Map());
    const [isSend, setIsSend] = useState<{ state: number, data: any }>({state: 0, data: undefined});
    const [cntRcv,setCntRcv] = useState(0);
    const [current, setCurrent] = useState<string>(''); //群聊id
    const textRef: React.RefObject<HTMLTextAreaElement> = createRef();
    const userInfo = useSelector((state: any) => {
        return state.UserReducer?.userInfo
    })


    //首先需要判断是否已经建立群聊
    useEffect(() => {
        tApi.getMemberList({name:userInfo.username,data:{ct_id: props.serviceId}}).then((res: any) => {
            if (res.length === 0)//没有群聊
                setMode(true);
            else {
                let temp: Map<string, GroupInfo> = new Map();
                for (let i = 0; i < res.length; i++) {
                    let tmp:GroupInfo = {members:[],builder:'',is_read:1,mg_id:res[i].mg_id,lastMID:0,lastTime:''};
                    let len = res[i].members.length;
                    for (let j = 0; j < len - 1; j++)
                        tmp.members.push({
                            memberName: res[i].members[j].username,
                            email: res[i].members[j].email,
                        });
                    tmp.builder = res[i].members[len-1].build_username;
                    tmp.is_read = res[i].is_read;
                    tmp.lastMID = res[i].m_id;
                    tmp.lastTime = res[i].m_gmt_create;
                    temp.set(res[i].mg_id,tmp);
                }
                setGroupList(temp);
                setMode(false);
            }
        }).catch(() => {
            setMode(true)
        })
    }, [loading]);

    //换群聊的时候，如果没有信息需要请求信息
    //包括信息请求，和已读未读判断
    useEffect(() => {
        if (current !== ''&&msgs.get(current) === undefined) {//选中群聊，且群聊中没有信息
            let tmpGL = copyMap(groupList);
            tmpGL.get(current).is_read = 1;
            setGroupList(tmpGL);
            tApi.getMessages({name:userInfo.username,data:{mg_id: current, last_m_id: null}})
                .then((res: any) => {
                    let temp = copyMap(msgs);
                    if(res === undefined) //没有信息
                        return
                    temp.set(current, res.map((value: any) => {
                        return {
                            content: value.m_content,
                            from: value.username,
                            from_email:  groupList.get(current)?.members.find(vv => vv.memberName === value.username)?.email,
                            m_gmt_create: value.m_gmt_create,
                            m_id:value.m_id,
                            type:value.username === userInfo.username ? 'send' : 'receive'
                        }
                    }).reverse());

                    setMsgs(temp);
                })
        }
    }, [current]);


    //消息发送,当newMsg变化时，消息发送
    function handleMsg(content: string) {
        const msg = {
            mg_id: current,
            content: content,
            from: userInfo.username,
            from_email: userInfo.email,
            m_gmt_create: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            type: 'send'
        }
        //首先判断current是否已经存在消息
        let tempMsg = copyMap(msgs);
        if (tempMsg.get(current) !== undefined) {
            tempMsg.get(current).push(msg);
        } else {
            tempMsg.set(current, [msg])
        }
        setIsSend({state: isSend.state + 1, data: {mode: 1, mg_id: current, m_content: content}});
        setMsgs(tempMsg)
    }

    function getGroupName(ad: string) {
        if (groupList.get(ad)) {
            return groupList.get(ad)?.builder;
        }
        return '';
    }

    function clearMsg() {
        // 清空输入框
        if (textRef.current)
            textRef.current.value = ""
    }


    // 收到消息的处理
    const receiveMSG = (data: any) => {
        //当前消息可以通过getMessage得到，则不处理(或者之后推送)
        if(Array.from(groupList.keys()).length === 0)
            return
        // @ts-ignore
        if(data.m_id <= groupList.get(data.mg_id)?.lastMID)
            return
        //判断接收消息是否在当前群聊，如果在则想后端ws发送已读信息
        if(data.mg_id === current)
        {
            setCntRcv(cntRcv-1)
            setIsSend({state:isSend.state+1,data:{mode:4,username:userInfo.username,m_id:data.m_id}})
        }
        const msg = {
            mg_id: data.mg_id,
            content: data.m_content,
            from: data.username,
            from_email: groupList.get(data.mg_id)?.members.find(vv => vv.memberName === data.username)?.email,
            m_create_time: new Date().toTimeString(),
            type: 'receive'
        }
        let tmpMsg = copyMap(msgs);
        if (tmpMsg.get(data.mg_id)) {
            tmpMsg.get(data.mg_id).push(msg)
        } else {
            tmpMsg.set(data.mg_id,[msg]);
        }
        setCntRcv(cntRcv+1);
        setMsgs(tmpMsg);
    }
    return (
        <>
            {!mode ?
                (
                    <>
                        <div className={'processing-sendmsg'}>
                            <ChatSocket message={isSend.state} data={isSend.data} dataHandle={receiveMSG}
                                        token={userInfo.token}/>
                        </div>
                        <Row className={"chat-room"}>
                            <Col span={5}>
                                <MemberList setCurrent={setCurrent} memberList={groupList}/>
                            </Col>
                            <Col span={17}>
                                <div style={{height: "70%"}}>
                                    <MessageContainer getName={getGroupName} groupList={groupList} setMsgs={setMsgs}
                                                      msgs={msgs} newSend={isSend.state}
                                                      current={current} rcvCnt={cntRcv}
                                    />
                                </div>
                                <div style={{height: "30%"}}>
                                    <MessageEditor current={current} textRef={textRef} handleMsg={handleMsg}
                                                   clearMsg={clearMsg}
                                                   userInfo={userInfo}/>
                                </div>
                            </Col>
                        </Row>
                    </>
                ) : false ?(<Button onClick={() => {
                    setLoading(true);
                    tApi.addGroup({name:userInfo.username,data:{ct_id: props.serviceId}})
                        .then(() => {
                            setMode(false);
                            setLoading(false);
                        })
                        .catch(() => {
                            setLoading(false);
                        })
                }
                } loading={loading}>创建当前群聊</Button>) : (<>
                    <Result
                        title={"还没有同学建立群聊！"}
                    />
                </>)
            }
        </>
    )
}
export default (
    withTranslation()(
        withRouter(ChatRoom)
    ));