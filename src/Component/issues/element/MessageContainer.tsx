import React, {createRef, useEffect, useState} from "react";
import {withTranslation} from "react-i18next";
import {withRouter} from "react-router";
import './MessageContainer.css'
import Avatar from "../../user/Avatar";
import tApi from "../t-api";
import {useSelector} from "react-redux";
import {copyMap} from "../ChatRoom";
import {message} from "antd";

const MessageContainer = (props:any) => {
    const {current,setMsgs,groupList,msgs,newSend,rcvCnt} = props;
    const Message=msgs.get(current) ? msgs.get(current) : []
    const scrollbar:React.RefObject<HTMLDivElement> = createRef();
    const userInfo = useSelector((state: any) => {
        return state.UserReducer?.userInfo
    })
    const [len,setLen] = useState(0);
    function handleScroll(){
        //预留消息加载
        if(scrollbar.current?.scrollTop === 0)
        {
            tApi.getMessages({name:userInfo.username,data:{mg_id:current,last_m_id:Message[0].m_id}})
                .then((res: any) => {
                    let temp = copyMap(msgs);
                    if(res&&res.length > 1)
                    {
                        temp.set(current,[...res.map((value: any) => {
                            return {
                                content: value.m_content,
                                from: value.username,
                                from_email:  groupList.get(current)?.members.find((vv:any) => vv.memberName === value.username)?.email,
                                m_gmt_create: value.m_gmt_create,
                                m_id:value.m_id,
                                type:value.username === userInfo.username ? 'send' : 'receive'
                            }
                        }).reverse(),...temp.get(current)])
                        setMsgs(temp);
                        message.success('刷新成功')
                    }
                })
        }
    }
    //发送消息滚动条到最底端，但是收到消息之后也应该在最低端而不是最顶端
    useEffect(() => {
        if(scrollbar.current)
            scrollbar.current.scrollTop = scrollbar.current.scrollHeight;
    }, [newSend, current]);
    //应对下拉刷新滚动条位置不变，以及初始滚动条在最底端。
    useEffect(()=>{
        if(len !== 0)
        {
            if(scrollbar.current&&Message.length > len + newSend + rcvCnt)
            {
                scrollbar.current.scrollTop = scrollbar.current.scrollHeight/Message.length*(Message.length- len - newSend - rcvCnt);
                setLen(Message.length-newSend)
            }
        }else{
            if(scrollbar.current)
                scrollbar.current.scrollTop = scrollbar.current.scrollHeight;
            setLen(Message.length - newSend - rcvCnt)
        }
    },[scrollbar])



    const items = Message.map((value:any, index:number) =>
        <div key={index.toString()} className={`chat-room-message-item-${value.type}`}>
            <div className="chat-room-message-item-avatar">
                <Avatar email={value.from_email} shape={'square'}/>
            </div>

            <div className={"chat-room-message-item-body"}>
                <div className={"chat-room-message-item-info"}>
                    {value.from}
                </div>
                <div className={"chat-room-message-item-text"}>
                    {value.content}
                </div>
            </div>
        </div>
    )
    return (
        <div className="chat-room-message">
            <div className="chat-room-message-header">
                <div className={"chat-room-message-header-username"}>{props.getName(current)}</div>
            </div>
            <div  ref={scrollbar} onScrollCapture={handleScroll} className="chat-room-message-body">
                {items}
            </div>
        </div>
    )
}

export default (
    withTranslation()(
        withRouter(MessageContainer)
    ));