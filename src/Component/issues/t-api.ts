import request from "./request";
const tApi = {
    async getMsg(data:any){
        return request.get("/message/getMessage", data)
    },
    async getNoticeList(data:any){
        return request.get("/notice/getNoticeList", data.name,data.data)
        // return {totalNums:15,totalPages:2,rows:[{nt_id:'1',nt_title:'第一题',nt_gmt_create:"1000102020310",nt_gmt_modified:"202100150155"}]}
    },
    async getNotice(data:any){
        // return {username:'yd3826',email:"1494106501@qq.com",nt_gme_create:"10001080101",nt_content:"不可否认，段昱是最帅的"}
        return request.get(`/notice/getNotice/${data.data.nt_id}`, data.name)
    },
    async getMemberList(data:any){
        return request.get("/message/viewMessage",data.name,data.data);
    },
    async addGroup(data:any){
        return request.post("/message/addMessageGroup",data.name,data.data)
    },
    async auth(data:any){
        return request.post("/ws/auth",data.name,{})
    },
    async getMessages(data:any){
        return request.get("/message/getMessage",data.name,data.data)
    },
    async deleteNotice(data:any){
        return request.post("/notice/deleteNotice",data.name,data.data)
    }

}
export default tApi;