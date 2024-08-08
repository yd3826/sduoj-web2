import {withTranslation} from "react-i18next";
import {withRouter} from "react-router";
import {Button, Modal} from 'antd';
import {useState} from "react";
import ChatRoom from "./ChatRoom";
import Information from "./Information";

const IssueFloatButton = (props:any)=>{
    const [open1,setOpen1] = useState<boolean>(false);
    const [open2,setOpen2] = useState<boolean>(false);
    return(
        <>
            <Button onClick={()=>{setOpen1(true)}}>chat</Button>
            <Modal
                visible={open1}
                width={1100}
                footer={false}
                bodyStyle={{height:600}}
                onCancel={()=>{setOpen1(false)}}
                destroyOnClose={true}
            >
                <ChatRoom serviceId={props.service_id} contestInfo={props.contestInfo}/>
            </Modal>
            <Button onClick={()=>{setOpen2(true)}}>公告</Button>
            <Modal
                visible={open2}
                width={1100}
                footer={false}
                bodyStyle={{height:600}}
                onCancel={()=>{setOpen2(false)}}
                destroyOnClose={true}
            >
                {/*<ChatRoom problemId={"1000"}/>*/}
                <Information serviceId={props.service_id} contestInfo={props.contestInfo}/>
            </Modal>
        </>
    );
}

export default(
    withTranslation()(
        withRouter(IssueFloatButton)
    ));