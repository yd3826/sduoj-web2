import {Form, Input} from "antd";
import React from "react";
import {withTranslation} from "react-i18next";
import CApi from "../../../../Utils/API/c-api";

const ItemUsername = (props: any) => {
    return (
        <Form.Item
            name="username"
            label={props.t("username")}
            initialValue={props.value}
            rules={
                [
                    {required: props.editable, message: props.t("usernameEmpty")},
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if(props.needExist === true){
                                return CApi.isExist({username: value}).then((data: any)=>{
                                    if(data === false) return Promise.resolve()
                                    else if(data === true) return Promise.reject("用户名已存在")
                                    return Promise.reject("检验失败")
                                }).catch((e: any)=>{
                                    return Promise.reject(e)
                                })
                            } return Promise.resolve()
                        },
                    }),
                ]
            }
            hasFeedback>
            <Input
                disabled={props.editable === false}
                bordered={props.editable}
            />
        </Form.Item>
    )
}

export default withTranslation()(ItemUsername)