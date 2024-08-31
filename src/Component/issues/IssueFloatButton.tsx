import {withTranslation} from "react-i18next";
import {withRouter} from "react-router";
import {Badge, Button, Modal,notification} from 'antd';
import {useEffect, useState} from "react";
import ChatRoom from "./ChatRoom";
import Information from "./Information";
import {useSelector} from "react-redux";
import useWebSocket from "react-use-websocket";

const IssueFloatButton = (props:any)=>{
    const [open1,setOpen1] = useState<boolean>(false);
    const [open2,setOpen2] = useState<boolean>(false);

    const isLogin = useSelector((state: any) => state.UserReducer.isLogin)
    const {sendMessage, lastMessage, readyState} = useWebSocket(
        "wss://oj.cs.sdu.edu.cn:8889/imapi" + `/ws/handle/${props.token}`, {share: false},isLogin,
    );
    const [unRead,setUnRead] = useState<number>(0);
    const [unRead2,setUnRead2] = useState<number>(0);
    useEffect(()=>{
        if(lastMessage !== null && lastMessage !== undefined)
        {
            const data = JSON.parse(lastMessage.data)
            if(data.m_id !== undefined)
            {
                if(!open1)
                    setUnRead(1);
            }
            else{
                if(!open2)
                {
                    console.log(data)
                    //收到通知的处理
                    setUnRead2(1);
                    //弹窗
                    notification.open({
                        message:data.nt_title,
                    })
                }
            }
        }
    },[lastMessage])
    return(
        <>
            <Badge count={unRead} dot>
            <Button onClick={() => {
                setOpen1(true);
                setUnRead(0);
            }}>chat</Button>
            </Badge>
            <Modal
                visible={open1}
                width={1100}
                footer={false}
                bodyStyle={{height: 600}}
                onCancel={() => {
                    setOpen1(false)
                }}
                destroyOnClose={true}
            >
                <ChatRoom serviceId={props.service_id} sendMessage={sendMessage} lastMessage={lastMessage} readyState={readyState} isLogin={isLogin}
                          contestInfo={props.contestInfo}/>
            </Modal>
            <Badge dot count={unRead2}>
            <Button onClick={() => {
                setOpen2(true);
                setUnRead2(0);
            }}
            >公告</Button>
            </Badge>
            <Modal
                visible={open2}
                width={1100}
                footer={false}
                bodyStyle={{height: 600}}
                onCancel={() => {
                    setOpen2(false)
                }}
                destroyOnClose={true}
            >
                {/*<ChatRoom problemId={"1000"}/>*/}
                <Information serviceId={props.service_id} contestInfo={props.contestInfo}
                             sendMessage={sendMessage} lastMessage={lastMessage} readyState={readyState} isLogin={isLogin}
                />
            </Modal>
        </>
    );
}

export default (
    withTranslation()(
        withRouter(IssueFloatButton)
    ));