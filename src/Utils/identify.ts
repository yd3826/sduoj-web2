/**
 * 主要识别manager,判断是否为某一组的助教
 */

export default function identify(g:number,selfgs:any){
    return g in selfgs;
}