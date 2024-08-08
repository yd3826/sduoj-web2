import {connect, useSelector} from "react-redux";
import {ConfigState} from "../../Type/IConfig";
import {UserState} from "../../Type/Iuser";

export const Name2Header:any ={
    '':'',
    superadmin:"%22%7B%5C%22userId%5C%22%3A1%2C%5C%22username%5C%22%3A%5C%22superadmin%5C%22%2C%5C%22nickname%5C%22%3A%5C%22superadmin%5C%22%2C%5C%22email%5C%22%3A%5C%22sduoj%40sdu.edu.cn%5C%22%2C%5C%22studentId%5C%22%3A%5C%22sducs%5C%22%2C%5C%22roles%5C%22%3A%5B%5C%22superadmin%5C%22%2C%5C%22admin%5C%22%2C%5C%22user%5C%22%5D%2C%5C%22groups%5C%22%3A%5B1%2C16%2C21%5D%2C%5C%22ipv4%5C%22%3A%5C%22127.0.0.1%5C%22%2C%5C%22userAgent%5C%22%3A%5C%22Mozilla/5.0%20%28Windows%20NT%2010.0%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/127.0.0.0%20Safari/537.36%20Edg/127.0.0.0%5C%22%7D%22",
    ndkndk:"%22%7B%5C%22userId%5C%22%3A8853%2C%5C%22username%5C%22%3A%5C%22ndkndk%5C%22%2C%5C%22nickname%5C%22%3A%5C%22ndk%5C%22%2C%5C%22email%5C%22%3A%5C%221494106501%40qq.com%5C%22%2C%5C%22studentId%5C%22%3A%5C%22202501010101%5C%22%2C%5C%22roles%5C%22%3A%5B%5C%22user%5C%22%5D%2C%5C%22groups%5C%22%3A%5B6%2C20%5D%2C%5C%22ipv4%5C%22%3A%5C%22127.0.0.1%5C%22%2C%5C%22userAgent%5C%22%3A%5C%22Mozilla/5.0%20%28Windows%20NT%2010.0%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/127.0.0.0%20Safari/537.36%20Edg/127.0.0.0%5C%22%7D%22",
    test:"%22%7B%5C%22userId%5C%22%3A8852%2C%5C%22username%5C%22%3A%5C%22test%5C%22%2C%5C%22nickname%5C%22%3A%5C%22yduan%5C%22%2C%5C%22email%5C%22%3A%5C%2215037872690%40139.com%5C%22%2C%5C%22studentId%5C%22%3A%5C%22202100150155%5C%22%2C%5C%22roles%5C%22%3A%5B%5C%22user%5C%22%5D%2C%5C%22groups%5C%22%3A%5B17%5D%2C%5C%22ipv4%5C%22%3A%5C%22127.0.0.1%5C%22%2C%5C%22userAgent%5C%22%3A%5C%22Mozilla/5.0%20%28Windows%20NT%2010.0%3B%20Win64%3B%20x64%3B%20rv%3A128.0%29%20Gecko/20100101%20Firefox/128.0%5C%22%7D%22",//firefox
    zyqq:"%22%7B%5C%22userId%5C%22%3A8854%2C%5C%22username%5C%22%3A%5C%22zyqq%5C%22%2C%5C%22nickname%5C%22%3A%5C%22zyq%5C%22%2C%5C%22email%5C%22%3A%5C%22nx8631%40163.com%5C%22%2C%5C%22studentId%5C%22%3A%5C%22202220202021%5C%22%2C%5C%22roles%5C%22%3A%5B%5C%22user%5C%22%5D%2C%5C%22groups%5C%22%3A%5B20%5D%2C%5C%22ipv4%5C%22%3A%5C%22127.0.0.1%5C%22%2C%5C%22userAgent%5C%22%3A%5C%22Mozilla/5.0%20%28Windows%20NT%2010.0%3B%20Win64%3B%20x64%29%20AppleWebKit/537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome/127.0.0.0%20Safari/537.36%20Edg/127.0.0.0%5C%22%7D%22"
}


const GetName = (props:any)=>{
    return props.username
}

const mapStateToProps = (state: any) => {
    const State: UserState = state.UserReducer
    return {
        username: State.userInfo?.username,
        }
}
export default connect(
    mapStateToProps
)(GetName)