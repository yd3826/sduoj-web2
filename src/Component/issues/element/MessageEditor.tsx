import {withTranslation} from "react-i18next";
import {withRouter} from "react-router";
import {Button, message} from "antd";
import './MessageEditor.css'


const MessageEditor = (props: any) => {
    const {current,textRef,clearMsg} = props;
    const handleKeyPress = (event:any)=>{
        if(event.key==='Enter'&&!event.shiftKey){
            event.preventDefault();
            handleSendMsg();
        }
    }
    //发送消息
    const handleSendMsg = () => {

        if (textRef.current?.value.trim() === "") {
            message.info('消息不能为空')
            clearMsg();
            return
        }

        if(current==='')
        {
            message.info('情选择发送对象')
            clearMsg();
            return
        }

        props.handleMsg(textRef.current?.value)
        clearMsg();
    }

    return (
        <div className={"chat-room-message-editor"}>
            <textarea
                ref={textRef}
                className={"chat-room-message-editor-textarea"}
                placeholder={"请输入你需要发送的内容"}
                onKeyPress={handleKeyPress}
            />

            <div className={"chat-room-message-editor-btn"}>
                <Button onClick={() => {
                    handleSendMsg()
                }} >发送</Button>
            </div>
        </div>
    );
}

export default (
    withTranslation()(
        withRouter(MessageEditor)
    ));