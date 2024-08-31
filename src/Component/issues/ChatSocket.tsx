import React, {useEffect} from 'react';
import {ReadyState} from 'react-use-websocket';


export interface IWebSocket {
    queryList: string[]
    dataHandle: any
    open: boolean
}

export const ChatSocket = (props:any) => {
    const {isLogin,sendMessage, lastMessage, readyState}=props;

    useEffect(() => {
        if (lastMessage !== null&&lastMessage !== undefined) {
            console.log('received message', lastMessage.data)
            const data = JSON.parse(lastMessage.data);
            props.dataHandle(data);
        }
    }, [lastMessage]);

    useEffect(() => {
        if (isLogin&&readyState === ReadyState.OPEN&&props.message>0) {
            console.log('send',props.data)
            sendMessage(JSON.stringify(props.data))
        }
    }, [props.message])

    // const connectionStatus = {
    //     [ReadyState.CONNECTING]: '连接中',
    //     [ReadyState.OPEN]: '已连接',
    //     [ReadyState.CLOSING]: '关闭中',
    //     [ReadyState.CLOSED]: '已关闭',
    //     [ReadyState.UNINSTANTIATED]: '未知',
    // }[readyState];

    return (
        <>
            {/*<span>(连接状态：{connectionStatus})</span>*/}
        </>
    );
};
