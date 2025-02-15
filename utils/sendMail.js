import transporter from "../config/noReplyMail"
export const sendMail = async (mailOptions) => {
    try{
        let info = await transporter.sendMail(mailOptions);
        return info? info : false;
    }catch (e){
        return false;
    };
};
