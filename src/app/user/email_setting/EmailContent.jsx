"use client"

import Popup from '@/app/components/popup/popup';
import { Form } from '@/utils/formValidator';
import styles from '@/style/emailSetting.module.css';
import svg from '@/utils/svg';
import { Table, TableHead, Paper, TableRow, TableCell, TableBody, TablePagination, TableFooter, TableContainer, Tooltip, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import dynamic from 'next/dynamic';
import { callAPI } from '@/utils/API';
import DatatableLoader from '@/app/components/loader/DatatableLoader';
import { emailContentObject } from '@/utils/data';
const CustomEditor = dynamic(() => {
    return import('../../components/CustomEditor');
}, { ssr: false });

function EmailContent() {
    const { register, handleSubmit, formState: { errors }, reset, control, setValue } = useForm();
    const [editPopUp, setPopUp] = useState(false);
    const [openCodes, setOpenCodes] = useState(false);
    const [emailList, setEmailList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [EditRowContent, setEditRowContent] = useState({});
    const [editorData, setEditorData] = useState('');
    const [btnLoder, setBtnLoader] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetchEmailNotification()
    }, [])


    const fetchEmailNotification = () => {
        setLoading(true);
        callAPI({
            method: 'GET',
            url: `/common/emailNotifications`,
        }, (resp) => {
            setLoading(false);
            if (resp) {
                setEmailList(resp.data);
            }
        })
    }

    const onSubmitCreate = (updatedvalues) => {
        setBtnLoader(true);
        callAPI({
            method: 'POST',
            url: `/common/emailNotifications?id=${EditRowContent?._id}`,
            data: {
                title: EditRowContent.Details.title,
                Subject: updatedvalues.subject,
                message: editorData
            }
        }, (resp) => {
            setBtnLoader(false);
            if (resp) {
                setOpenCodes(false);
                fetchEmailNotification();
                setPopUp(false);
                setEditRowContent({});
            }
        })
    }

    const PopupCloseHandler = (val) => {
        setOpenCodes(false);
        setPopUp(false);
        setEditRowContent({});
    }

    const handleEditorContent = (data) => {
        setEditorData(data);
    }

    return (
        <div className='datatable_wrap email_content_table'>
            <TableContainer component={Paper} className='table_container'>
                <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">

                    <TableHead className='table_head'>
                        <TableRow>
                            <TableCell align="left" className='table_head'>S.No</TableCell>
                            <TableCell align="left" className='table_head'> Name</TableCell>
                            <TableCell align="left" className='table_head'>Actions</TableCell>
                        </TableRow>
                    </TableHead>


                    <>
                        <TableBody className='table_body'>
                            {loading ? <TableRow><TableCell align="center" className='table_data' colSpan={6}><DatatableLoader /></TableCell></TableRow>
                                :
                                emailList?.map((row, i) => (
                                    <TableRow className='table_row' key={i}>
                                        <TableCell style={{ width: 20 }} align="left" className='table_data'>
                                            {i + 1}
                                        </TableCell>
                                        <TableCell style={{ width: 560 }} align="left" className='table_data'>
                                            <span> {row.Details.title}</span>

                                        </TableCell>

                                        <TableCell style={{ width: 100 }} align="left" className='table_data'>
                                            <div className='table_action_wrap'>
                                                <Tooltip title="Edit" placement="top" arrow>
                                                    <div className="action_edit" onClick={() => { setPopUp(true); setEditRowContent(row); setValue('subject', row?.Details?.Subject) }}>{svg.edit}</div>
                                                </Tooltip>

                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>

                    </>

                </Table>
            </TableContainer>


            <Popup show={editPopUp} onClose={PopupCloseHandler} heading={`Edit Email Notification`}>
                <form onSubmit={handleSubmit(onSubmitCreate)}>

                    <Form fieldname='subject' label='Subject' inputType='text' register={register} errors={errors} isRequired={true} />

                    <div className="input_wrapper">
                        <label>Body <span className='bhub_required'>*</span></label>
                        <CustomEditor
                            initialData={EditRowContent?.Details?.message ? EditRowContent?.Details?.message : 'Default message'}
                            onChange={handleEditorContent}
                        />
                    </div>

                    <div className={styles.code_wrapper}>
                        <div className='profile_wrapper mb'>
                            Codes  <div className={openCodes ? 'up_arrow' : 'down_arrow'} onClick={() => setOpenCodes(!openCodes)}>{svg.down_arrow}</div>
                        </div>
                        <div className={openCodes ? styles.code_detail_show : styles.code_detail_hide}>
                            <table>
                                <tbody>
                                    {
                                        (Object.keys(EditRowContent).length != 0) && Object.keys(emailContentObject[EditRowContent?.type]).map((obj, i) => (
                                            <tr key={i}>
                                                <td className={styles.codes_table}>
                                                    <Tooltip title={copied && "Copied"} placement="top" arrow>
                                                        <input value={'${' + `${obj}` + '}'} style={{ border: '0', outline: '0', marginBottom: '2px' }} readOnly="readOnly" onClick={(e) => {
                                                            e.target.select();
                                                            navigator.clipboard.writeText('${' + `${obj}` + '}').then(() => {
                                                                setCopied(true);
                                                                setTimeout(() => setCopied(false), 3000);
                                                            });
                                                        }} /></Tooltip> – {emailContentObject[EditRowContent?.type][obj]}</td>

                                            </tr>
                                        ))


                                    }

                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="text-right mt">
                        <button type="submit" className="ap_btn" >Save Notification {btnLoder ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : ''}</button>
                    </div>
                </form>
            </Popup>

        </div>
    )
}

export default EmailContent