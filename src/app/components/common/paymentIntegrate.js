'use client'
import { useState, useEffect, Suspense } from 'react';
import { Table, TableHead, Paper, TableRow, CircularProgress, TableCell, TableBody, TableContainer, Alert, Tooltip } from '@mui/material';
import svg from '@/utils/svg';
import { callAPI } from '@/utils/API';
import Popup from '@/app/components/popup/popup';
import { Form } from '@/utils/formValidator';
import { useForm } from "react-hook-form";
import ConfirmDeletePopup from '../popup/deleteConfirm';
import styles from '@/style/payment.module.css'
import DatatableLoader from '../loader/DatatableLoader';
import { useSelector } from 'react-redux';

const PaymentIntegrate = () => {

    const { register, handleSubmit, control, formState: { errors }, reset } = useForm();
    const user = useSelector((store) => store.storeData.auth.user)

    const [paymentlist, setPaymentList] = useState([]);
    const [showPopUp, setShowPopUp] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [btnLoader, setBtnLoader] = useState(false);
    const [isEdit, setisEdit] = useState(false);
    const [deleteId, setDeleteId] = useState('');
    const [deletePopUp, setDeletePopUp] = useState(false);
    const [loader, setLoader] = useState(true);
    const [campaignInfoPopup, setcampaignInfoPopup] = useState(false);
    const [campaignName, setcampaignName] = useState([]);

    const fetchlist = () => {
        setLoader(true)
        callAPI({
            method: 'GET',
            url: `/common/paymentIntegrate`,
        }, (resp) => {
            setPaymentList(resp.accountList)
            setLoader(false);
        })
    }

    useEffect(() => {
        fetchlist();
    }, [])

    const addPaymentMethod = (props) => {
        if (user.role == 1) {
            const hasAccount = paymentlist.some(item => item.paymentMethod === props);
            if (hasAccount) return;
        }
        setShowPopUp(true)
        setisEdit(false)
        setPaymentMethod(props);
        reset({
            accountId: '',
            publicKey: '',
            secretKey: '',
        })
    }

    const onSubmitCreate = (newdata) => {
        setBtnLoader(true)
        newdata.paymentMethod = paymentMethod,
        newdata.status = 1;
            callAPI({
                method: 'POST',
                url: `/common/paymentIntegrate`,
                data: newdata
            }, (resp) => {
                fetchlist();
                setBtnLoader(false)
                setShowPopUp(false)
            })
    }

    const editPaymentMethod = (data) => {

        setShowPopUp(true)
        setPaymentMethod(data.paymentMethod);

        setisEdit(true);
        reset({
            accountId: data.accountId,
            publicKey: data.publicKey,
            secretKey: data.secretKey,
        })
    }

    const onSubmitUpdate = (newdata) => {
        setBtnLoader(true)
        newdata.paymentMethod = paymentMethod;
        newdata.status = 1;
        callAPI({
            method: 'POST',
            url: `/common/paymentIntegrate?id=${newdata.accountId}`,
            data: newdata
        }, (resp) => {
            setBtnLoader(false)
            setShowPopUp(false)
            fetchlist();
        })
    }

    const deleteUser = (id) => {
        if (id) {
            callAPI({
                method: 'DELETE',
                url: `common/paymentIntegrate?id=${id}`,
            }, (resp) => {
                if (resp.status == 1) {
                    setDeletePopUp(false);
                    fetchlist();
                }
            })
        }
    }

    const handleDelete = (id, campaigns) => {
        if (campaigns.length > 0) {
            setcampaignName(campaigns);
            setcampaignInfoPopup(true);
        }
        else {
            setDeletePopUp(true);
            setDeleteId(id);
        }
    }

    const handlePopUp = (val) => {
        if (val) {
            deleteUser(deleteId);
        }
        setDeletePopUp(false);
    }

    const deletePopupCloseHandler = () => { setDeleteId(''); setDeletePopUp(false); }

    const PopupCloseHandler = (val) => {
        setShowPopUp(val);
        setcampaignName([]);
        setcampaignInfoPopup(false);
    }


    const handleStatusUpdate =(status, id) =>{
        if(id){
        callAPI({
            method: 'PUT',
            url: `/common/paymentIntegrate`,
            data: {status, id}
        }, (resp) => {
            if(resp.status == 1){
                fetchlist();
            }   
        })}
    }
    return (

        <>
            <div className='center_content'>
                <div className={styles.payment_main}>
                    <div className={`${styles.payment_svg} ${user.role == 1 && paymentlist.some(item => item.paymentMethod === "paypal") && styles.pay_disable}`} onClick={() => addPaymentMethod('paypal')}>{svg.paymentt}</div>
                    <div className={`${styles.payment_stripe} ${user.role == 1 && paymentlist.some(item => item.paymentMethod === "stripe") && styles.pay_disable}`} onClick={() => addPaymentMethod('stripe')}>{svg.stripe}</div>
                </div>
            </div>


            <div className={(paymentlist.length) ? 'datatable_wrap pay_table ' : 'hide'}>



                        <TableContainer component={Paper} className='table_container'>
                            <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                                <TableHead className='table_head'>
                                    <TableRow>
                                        <TableCell className='table_head'>S.No</TableCell>
                                        <TableCell align="left" className='table_head'>Payment Method</TableCell>
                                        <TableCell align="left" className='table_head'>Account ID</TableCell>
                                        {user.role == 1  &&  <TableCell align="left" className='table_head'>Status</TableCell>}
                                        <TableCell align="left" className='table_head'>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <>
                                    <TableBody className='table_body'>
                                    {loader ? <TableRow><TableCell align="center" className='table_data' colSpan={6}><DatatableLoader/></TableCell></TableRow>
                                            :
                                        paymentlist.map((row, i) => ( 
                                            <TableRow className='table_row' key={i}>
                                                <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                                    {i + 1}
                                                </TableCell>
                                                <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                                    {row.paymentMethod}
                                                </TableCell>
                                                <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                                    {row.accountId}
                                                </TableCell>
                                               {user.role == 1  &&  <TableCell style={{ width: 160 }} align="left" className='table_data'>

                                                <div className="xs_switch">
                                            
                                              <input
                                                    id={'userChk_' +  i}
                                                    type="checkbox"
                                                    value={row?.status == 1 ? 1 : 0}
                                                    defaultChecked={row?.status == 1 ? true : false}
                                                    onChange={(e) =>handleStatusUpdate(!row?.status , row._id)}
                                                />
                                          
                                                <label htmlFor={'userChk_' + i}>
                                                 <span className="xs_switch_icon"></span>
                                                    <span className="xs_switch_text">{row.status == 1 ? 'Active' : 'Inactive'}</span>
                                                </label>
                                            </div>
                                            </TableCell>}

                                                <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                                    <div className='table_action_wrap'>
                                                    <Tooltip title="Edit" placement="top" arrow>  <div className="action_edit" onClick={() => editPaymentMethod(row)}>{svg.edit}</div>
                                                    </Tooltip>
                                                  {user.role != 1  && 
                                                  <Tooltip title="Delete" placement="top" arrow>    <div className="action_delete" onClick={() => handleDelete(row._id, row.campaigns)} >{svg.delete}</div>
                                                    </Tooltip>
                                                    } 
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </>
                            </Table>
                        </TableContainer>

            </div>
            <div className='pay_table'> 
            {user.role == 1 && <Alert severity="info" className='mt'>Please note that you can only add one account for each payment method.</Alert>}
            </div>
         
            <Popup show={showPopUp} onClose={PopupCloseHandler} >
                <form onSubmit={isEdit ? handleSubmit(onSubmitUpdate) : handleSubmit(onSubmitCreate)}>
                    {paymentMethod == 'paypal' ?
                        <>
                            {isEdit ? <Form fieldname='accountId' label='Account ID' inputType='email' register={register} errors={errors} isDisable={true} isRequired={true} />
                                : <Form fieldname='accountId' label='Account ID' inputType='email' register={register} errors={errors} isRequired={true} />}
                            <Form fieldname='publicKey' label='Client ID' inputType='text' register={register} errors={errors} applyValidation={false} isRequired={true} />
                            <Form fieldname='secretKey' label='Client Secret' inputType='password' register={register} errors={errors} isRequired={true} />
                        </>
                        :
                        <>
                            {isEdit ? <Form fieldname='accountId' label='Account ID' inputType='text' register={register} errors={errors} isDisable={true} isRequired={true} />
                                : <Form fieldname='accountId' label='Account ID' inputType='text' register={register} errors={errors} applyValidation={false} isRequired={true} />}
                            <Form fieldname='publicKey' label='Public Key' inputType='text' register={register} errors={errors} applyValidation={false} isRequired={true} />
                            <Form fieldname='secretKey' label='Secret Key' inputType='password' register={register} errors={errors} isRequired={true} applyValidation={false} />
                        </>
                    }

                    <div className="text-center">
                        <button type="submit" className="ap_btn ap_btn_full" disabled={btnLoader}>Add
                            {btnLoader ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : ''}
                        </button>
                    </div>
                </form>
            </Popup>

            <Popup
                heading={"Delete permanently"}
                show={deletePopUp}
                maxWidth={'440px'}
                type="delete"
                onClose={deletePopupCloseHandler}
            >
                <ConfirmDeletePopup handlePopUp={handlePopUp} title=" parmanently" />
            </Popup>


            <Popup
                heading={"Alert"}
                show={campaignInfoPopup}
                maxWidth={'440px'}
                type="delete"
                onClose={PopupCloseHandler}
            >
                <Alert severity="info" className='mt'>This payment method is used in following campaigns :
                    <ul>
                        {campaignName.map((name, index) => (
                            <li key={index}>{name.name}</li>
                        ))}
                    </ul>
                    Please change payment method in mentioned campaigns if you want to remove this payment method.</Alert>
            </Popup>

        </>
    )
}

export default PaymentIntegrate