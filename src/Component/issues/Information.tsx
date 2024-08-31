import TableWithPagination from "../common/Table/TableWithPagination";
import tApi from "./t-api";
import {Button, Card, Modal, Space, Tag} from "antd";
import React, {useState} from "react";
import './Information.css'
import ModalFormUseForm from "../common/Form/ModalFormUseForm";
import ItemTitle from "../common/Form/Item/ItemTitle";
import ItemEditor from "../common/Form/Item/ItemEditor";
import {withTranslation} from "react-i18next";
import {InfoCircleOutlined} from "@ant-design/icons";
import NTFCContent from "./element/Content";
import {ChatSocket} from "./ChatSocket";
import {useDispatch, useSelector} from "react-redux";
import TableRowDeleteButton from "../common/Table/TableRowDeleteButton";

const Information = (props:any)=>{
    const [visible,setVisible] = useState(false);
    const [showId, setShowId] = useState(0);
    const [showTitle, setShowTitle] = useState("");
    // const contestInfo = props.contestInfo;
    const dataSource = useSelector((state:any)=>state.TableReduce.tableData[`Notification${props.serviceId}`]);
    const dispatch = useDispatch();
    const userInfo = useSelector((state: any) => {
        return state.UserReducer?.userInfo
    })
    const setDataSource = (data: any, name: string) => {
        return dispatch({type: 'setDataSource', data: data, name: name, add: true})
    }
    const [isSend, setIsSend] = useState<{ state: number, data: any }>({state: 0, data: undefined});
    const Form = (
        <>
            <ItemTitle name={'nt_title'}/>
            <ItemEditor label={"公告内容"} name={"nt_content"}/>
        </>
    )
    function receiveNt(value:any){
        if(dataSource===undefined)return
        if(value.mode===3)return
        const len = dataSource['dataSource'].length;
        if(value.nt_id <= dataSource['dataSource'][len-1].nt_id)
            return
        setDataSource([value,...dataSource['dataSource']],`Notification${props.serviceId}`);
    }

    return (
        <>
            <Modal
                title={props.t("NotificationDetails")+`(${showTitle})`}
                onCancel={()=>{setVisible(false)}}
                footer={null}
                visible={visible}
                width={1100}
                destroyOnClose={true}
            >
                <NTFCContent id={showId}/>
            </Modal>
            <ChatSocket sendMessage={props.sendMessage} lastMessage={props.lastMessage} readyState={props.readyState} isLogin={props.isLogin} message={isSend.state} data={isSend.data}
                dataHandle={(data:any)=>{receiveNt(data)}}
            />
            <Card
                title={
                    <Space>
                        <InfoCircleOutlined/>
                        {props.t("Notification")}
                    </Space>
                }
                extra={
                    (
                        // identify(contestInfo.manageGroupDTO.groupId,userInfo.groups)&&

                        (<ModalFormUseForm
                        TableName={`Notification${props.serviceId}`}
                        title={"发布"}
                        type={"create"}
                        width={1100}
                        subForm={[{component: Form}]}
                        dataSubmitter={(value: any) => {
                            setIsSend({state:isSend.state+1,data:{...value,mode:2,ct_id:props.serviceId}})
                            return Promise.resolve(value)
                        }}
                    />)
                    )
                }
                className={'information'}
            >
            <TableWithPagination
                size={'middle'}
                name={`Notification${props.serviceId}`}
                API={(data:any)=>{
                    return tApi.getNoticeList({name:userInfo.username,data:{...data,ct_id:props.serviceId}})
                }}
                defaultPageSize={5}
                columns={[
                    {
                        title:'ID',
                        dataIndex:'nt_id',
                        key:'ID'
                    },
                    {
                        title:props.t('title'),
                        dataIndex: 'nt_title',
                        key:'title',
                        render:(text:string,row:any)=>{
                            return(
                            <Space size={5}>
                                <Button size={"small"} type={"link"} onClick={() => {
                                    setVisible(true)
                                    setShowId(parseInt(row.nt_id))
                                    setShowTitle(row.nt_title)
                                }}>{text}</Button>
                                {row.top === 1 && (<Tag color={"#e10000"}>{props.t("Top")}</Tag>)}
                            </Space>
                            )
                        }
                    },
                    {
                        title:props.t('ReleaseDate'),
                        dataIndex:'nt_gmt_create',
                        key:'ReleaseDate',
                        render:(text:any)=>{
                            return text;
                        }
                    },
                    {
                        title:props.t('LastModifiedDate'),
                        dataIndex:'nt_gmt_modified',
                        key:'LastModifyDate',
                        render:(text:any)=>{
                            return text;
                        }
                    },
                    (
                    // identify(contestInfo.manageGroupDTO.groupId,userInfo.groups)&&
                       true && {
                        title: props.t('operation'),
                        key: 'operation',
                        render: (rows: any) => {
                            return (
                                <Space size={3}>
                                    <ModalFormUseForm
                                        TableName={`Notification${props.serviceId}`}
                                        title={"编辑 - " + rows.title}
                                        type={"update"}
                                        width={1100}
                                        subForm={[{component: Form}]}
                                        dataLoader={async () => {
                                            return tApi.getNotice({name: userInfo.username, data: {nt_id: rows.nt_id}})
                                                .then((res) => {
                                                    res = {...res, nt_title: rows.nt_title}
                                                    return Promise.resolve(res)
                                                })
                                        }}
                                        dataSubmitter={(value: any) => {
                                            setIsSend({
                                                state: isSend.state + 1,
                                                data: {...value, mode: 3, nt_id: rows.nt_id}
                                            })
                                            return Promise.resolve()
                                        }}
                                    />
                                    <TableRowDeleteButton
                                        type={"inline"}
                                        API={tApi.deleteNotice}
                                        data={{name: userInfo.username, data: {nt_id: rows.nt_id}}}
                                        name={`Notification${props.serviceId}`}/>
                                </Space>
                            )
                        }
                    }
                    )
                ]}
            >

            </TableWithPagination>
            </Card>

        </>
    )
};

export default withTranslation()(Information);