import {withTranslation} from "react-i18next";
import {Button, Comment, Tooltip} from 'antd'
import React, {useEffect, useState} from "react";
import UserAvatar from "../../user/Avatar";
import MarkdownText from "../../../Utils/MarkdownText";
import moment from "moment/moment";
import tApi from "../t-api";
import {useSelector} from "react-redux";
import {Link} from "react-router-dom";

interface ContentType {
    author: string;
    email: string;
    text: string;
    time: any;
}

const NTFCContent = (props: any) => {
    const [content, setContent] = useState<ContentType | undefined>(undefined);
    const userInfo = useSelector((state: any) => {
        return state.UserReducer?.userInfo
    })
    useEffect(() => {
        tApi.getNotice({name:userInfo.username,data:{nt_id: props.id}})
            .then((res: any) => {
                setContent({
                    author: res.up_username,
                    email: res.email,
                    text: res.nt_content ,
                    time: new Date(res.nt_gmt_modified)
                })
            })
    }, [props.id])
    return (
        <>
        <Comment
            author={content?.author}
            avatar={<UserAvatar email={content?.email}/>}
            content={
                <MarkdownText id={"markdownPreview"} text={content?.text}/>
            }
            datetime={
                <Tooltip title={moment(content?.time).format('YYYY-MM-DD HH:mm:ss')}>
                    <span>{moment(content?.time).fromNow()}</span>
                </Tooltip>
            }
        />

        </>
    )
}

export default withTranslation()(NTFCContent)