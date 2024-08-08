import React, {useEffect, useState} from "react";
import './MemberList.css'
import {Badge} from "antd";
import Avatar from "../../user/Avatar";


const MemberList = (props:any)=>{
    const [items,setItems] = useState<any>();
    function handleMemberClick(value:any, e:any) {
        const {setCurrent, setUnread} = props
        const items:any = document.querySelectorAll(".chat-room-group-members-item")
        for (let value of items) {
            value.className = "chat-room-group-members-item"
        }
        e.preventDefault()
        e.currentTarget.className = "chat-room-group-members-item active"
        setCurrent(value)
    }


    useEffect(() => {
        const memberList = props.memberList;
        let keys: string[] = Array.from(memberList.keys())
        let Items = keys.map((key)=>{
            const groupName = memberList.get(key).builder;
            const buildEmail = memberList.get(key).members.find((e:any)=>e.memberName === groupName)?.email
            return (
                <div className="chat-room-group-members-item" key={key}
                     onClick={handleMemberClick.bind(this, key)}>
                    <Avatar email={buildEmail} shape={'square'}/>
                    <div className="chat-room-group-members-item-info" title={groupName}>
                        <Badge count={1^memberList.get(key).is_read} offset={[10, 2]} dot>
                            {groupName}
                        </Badge>
                    </div>
                </div>
            )
        })
        setItems(Items);
    }, [props.memberList]);


    return (
        <div className={"chat-room-group-members"}>
            {items}
        </div>
    )
}

export default MemberList;