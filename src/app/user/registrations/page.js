"use client"
import PageTitle from '@/app/components/common/PageTitle'
import { Form } from '@/utils/formValidator'
import { useForm } from "react-hook-form";
import { Table, TableHead, Paper, TableRow, TableCell, TableBody, TablePagination, TableFooter, TableContainer, Tooltip, CircularProgress } from '@mui/material';
import svg from '@/utils/svg';
import { useEffect, useState, useRef } from 'react';
import { callAPI } from '@/utils/API'
import { TablePaginationActions } from '@/app/components/common/TablePagination';
import DatatableLoader from '@/app/components/loader/DatatableLoader';
import Popup from '@/app/components/popup/popup';
import styles from '@/style/registration.module.css'
import { widgetCurrency } from '@/utils/data';
import { common } from '@/utils/helper';
import ConfirmDeletePopup from '@/app/components/popup/deleteConfirm';

function page() {
    const { register, handleSubmit: handleSubmit1, formState: { errors }, reset: reset1, control, watch, setValue, getValues } = useForm({ defaultValues: { campaign_type: 'appointment', filter_pay_status: '' } });
    const { reset: reset2, handleSubmit: handleSubmit2, formState: { errors: errors1 }, control: control1, register: register1 } = useForm();
    const FilterRef = useRef();

    const [registrationList, setRegistrationList] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loading, setLoading] = useState(true)
    const [count, setCount] = useState(0);
    const [userFilter, setUserFilter] = useState('');
    const [userDetailPopUp, setUserDetailPopUp] = useState(false);
    const [userDetail, setUserDetail] = useState({});
    const [btnLoader, setBtnLoader] = useState(false);

    const [declinePopUp, setDeclinePopup] = useState(false);
    const [statusId, setStatusId] = useState('');
    const [payStatusPopUp, setPayStatusPopUp] = useState({ id: '', show: false });

    const [filterShow, setFilterShow] = useState(false);
    const [campaignList, setCampaignList] = useState([]);
    const [filterDateRange, setFilterDateRange] = useState([]);
    const[deleteStore,setDeleteStore] = useState({showPopUp:false, deleteID:''})

    let appointment_status = watch("appointment_status");
    let campaign_Type = watch("campaign_type");
    let filter_pay_method = watch("filter_pay_method");
    let filter_date = watch("filter_date");
    let campaign_name = watch("campaign_name");
    let filter_pay_status = watch("filter_pay_status");

    let i = 0;
    common.useOutsideClick(FilterRef, () => {
        i++;
        if (i > 1) {
            setFilterShow(false);
        }
    });


    function getDates(startDate, endDate) {
        const dateArray = [];
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const formattedDate = currentDate.toISOString().split("T")[0];
            dateArray.push(formattedDate);
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dateArray;
    }

    useEffect(() => {
        if (filter_date) {
            const dateRange = getDates(filter_date[0], filter_date[1]);
            fetchRegistrations(userFilter, 0, rowsPerPage, campaign_Type, filter_pay_method, dateRange, campaign_name, filter_pay_status, appointment_status);
            setFilterDateRange(dateRange);
        }
    }, [filter_date])



    useEffect(() => {
        setPage(0);
        fetchRegistrations(userFilter, 0, rowsPerPage, campaign_Type, filter_pay_method, filterDateRange, campaign_name, filter_pay_status, appointment_status)
    }, [campaign_Type, filter_pay_method, campaign_name, filter_pay_status, appointment_status])

    const fetchRegistrations = (search = userFilter, pageNo = page, row = rowsPerPage, campType, paymentMode, filter_date, campaign_name, filter_pay_status, appointment_status) => {
        setLoading(true);
        let data = {
            type: campType,
            listPerPage: row,
            page: pageNo + 1,
            paymentMode: paymentMode,
            user: search,
            date: (filter_date) && filter_date[0],
            campaignId: campaign_name,
            paymentStatus: filter_pay_status,
            appointmentStatus: appointment_status == 'accepted' ? 1 : appointment_status == 'declined' ? 0 : null
        }

        callAPI({
            method: 'POST',
            url: `/user/registration`,
            data: data,
        }, (resp) => {
            setLoading(false);
            if (resp.status == 1) {
                setCount(resp.totalRecords)
                setRegistrationList(resp.registrationsDetail);
                setCampaignList(resp.campaignlist)
            }
        })
    }

    const handleChangePage = (event, newPage) => {
        fetchRegistrations(userFilter, newPage, rowsPerPage, campaign_Type)
        setPage(newPage);

    };

    const handleChangeRowsPerPage = (event) => {
        fetchRegistrations(userFilter, 0, parseInt(event.target.value, 10), campaign_Type)
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Search Event
    let clearUserFilter = (e) => {
        setUserFilter('');
        fetchRegistrations('', page, rowsPerPage, campaign_Type)
    }

    const dateClean = () => {
        setFilterDateRange([]);
        fetchRegistrations(userFilter, page, rowsPerPage, campaign_Type, filter_pay_method, '', campaign_name, filter_pay_status, appointment_status)
    }

    const handleUserSearchKeyupEvent = async (e) => {
        let t = e.target;
        let userFilter = t.value;
        setUserFilter(userFilter);

        if (e.keyCode === 13) {
            setPage(0)
            fetchRegistrations(userFilter, 0, rowsPerPage, campaign_Type, filter_pay_method, filterDateRange, campaign_name, filter_pay_status, appointment_status)
        }
    }

    function customizeDateFormate(date, mode) {
        if (mode && date) {
            if (mode == "DD-MM-YYYY") {
                const [day, month, year] = date.split('-');
                const dateObj = new Date(`${year}-${month}-${day}`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                return dateObj;
            } else if (mode == 'YYYY-MM-DD') {
                const [year, month, day] = date.split('-');
                const dateObj = new Date(`${year}-${month}-${day}`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                return dateObj;
            }

        } else {
            const formattedDate = new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            return formattedDate
        }
    }

    const PopupCloseHandler = () => {
        setUserDetailPopUp(false);
        setUserDetail({});
    }

    const DeclinePopupCloseHandler = (val) => {
        if (val == 'decline') {
            setDeclinePopup(false);
            fetchRegistrations(userFilter, page, rowsPerPage, campaign_Type);
        } else if (val == 'payment') {
            reset2('');
            setPayStatusPopUp({ id: '', show: false });
            fetchRegistrations(userFilter, page, rowsPerPage, campaign_Type);
        }
    }

    const onSubmit = (updatedvalues) => {
        let appointmentDetail = userDetail.Details;

        callAPI({
            method: 'PUT',
            url: `/user/registration?id=${statusId}`,
            data: { reason: updatedvalues.reason, appointmentDetail: appointmentDetail, userEmail: userDetail.Details.userInfo.Email },
        }, (resp) => {
            if (resp.status == 1) {
                fetchRegistrations(userFilter, page, rowsPerPage, campaign_Type);
                setDeclinePopup(false);

                reset1();
            }
        })
    }

    function isAppointmentInPast(appointmentDate) {
        const today = new Date();
        return appointmentDate < today;
    }

    function customizeId(inputString) {
        // Remove the last character if it is a hyphen
        if (inputString != undefined) {
            let resultString = inputString.replace(/-\d+$/, '');

            return resultString.trim();
        }
    }

    const paymentStatusHandle = (updatedvalues) => {
        setBtnLoader(true);
        callAPI({
            method: 'POST',
            url: `/user/dashboard`,
            data: {
                id: payStatusPopUp.id,
                date: updatedvalues.pay_date,
                time: updatedvalues.pay_time.toISOString(),
                remark: updatedvalues.pay_remark,
            },
        }, (resp) => {
            setBtnLoader(false);
            if (resp.status == 1) {
                fetchRegistrations(userFilter, page, rowsPerPage, campaign_Type);
                setPayStatusPopUp({ id: '', show: false });
                reset2({ 'pay_date': '', 'pay_time': '', 'pay_remark': '' });
            }
        })

    }

    const deleteDisableCheck = (data) => {
        let todayDate =new Date();
        if (data.campaignType == "appointment") {
            if (new Date(data.Details.appointmentDate) >= todayDate && data.status == 1) {
                return false
            }

        } else if (data.campaignType == "event") {
            if (new Date(data.Details.appointmentDate) >= todayDate) {
                return false
            }
        } else {           
                if (data.Details.bookingDate) {
                    if (new Date(data.Details.bookingDate) >= todayDate) {
                        return false
                    }
                } else {
                    if (new Date(data.Details.Checkoutdate) >= todayDate) {
                        return false
                    }                
            }
        }
        return true
    }

    const handleDeletePopUp =(val) =>{
        if(val){
            callAPI({
                method: 'GET',
                url: `common/trash?id=${deleteStore.deleteID}&type=registration`,
            }, (resp) => {
                if (resp.status == 1) {
                    setDeleteStore({showPopUp:false,deleteID:''});
                    fetchRegistrations(userFilter, 0, rowsPerPage, campaign_Type);
                }
            })
        }
        setDeleteStore({showPopUp:false,deleteID:''});
    }

    return (
        <div>
            <div className={(filterShow) ? "in filter_overlay_dark" : ''}></div>

            <PageTitle title="Registrations" sideFilter={filterShow} />
            <div className='content_wrapper' style={{ marginRight: filterShow ? '265px' : '0' }}>
                <div className='resg_box_wrap'>
                    <Form fieldname={'campaign_type'} label={`Campaign Type`} inputType={"radio"} options={[{ label: 'Appointments', value: 'appointment' }, { label: 'Events', value: 'event' }, { label: 'Bookings', value: 'booking' }]} control={control} errors={errors} isRequired={true} />
                    {(registrationList.length != 0) && <div className='ap_btn' onClick={() => setFilterShow(!filterShow)}>
                        {svg.filter} <span className={styles.filter_text}>Filter</span>
                    </div>}

                </div>

                <div className='datatable_wrap'>
                    <TableContainer component={Paper} className='table_container'>
                        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                            {(registrationList.length == 0 && !loading) ? null : <TableHead className='table_head'>
                                <TableRow>
                                    <TableCell align="left" className='table_head'>S.No</TableCell>
                                    <TableCell align="left" className='table_head'>Name</TableCell>
                                    <TableCell align="left" className='table_head'>Email</TableCell>
                                    <TableCell align="left" className='table_head'>Campaign </TableCell>
                                    <TableCell align="left" className='table_head'>Registration Date</TableCell>
                                    <TableCell align="left" className='table_head'>Payment Method</TableCell>
                                    <TableCell align="left" className='table_head'>Payment Status</TableCell>
                                    {(campaign_Type == 'appointment') && <TableCell align="left" className='table_head'>Appointment  Status</TableCell>}
                                    <TableCell align="left" className='table_head'>Details</TableCell>

                                </TableRow>
                            </TableHead>}

                            <>
                                <TableBody className='table_body'>

                                    {loading ? <TableRow><TableCell align="center" className='table_data' colSpan={10}><DatatableLoader /></TableCell></TableRow>
                                        :
                                        registrationList.map((row, i) => (
                                            <TableRow className='table_row' key={i}>
                                                <TableCell style={{ width: 40 }} align="left" className='table_data'>
                                                    {(rowsPerPage * page) + (i + 1)}
                                                </TableCell>
                                                <TableCell style={{ width: 100 }} align="left" className='table_data'>
                                                    {row.Details?.userInfo?.Name}
                                                </TableCell>
                                                <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                                    {row.Details?.userInfo?.Email}
                                                </TableCell>
                                                <TableCell style={{ width: 190 }} align="left" className='table_data'>
                                                    {row.campaignId?.title}
                                                </TableCell>
                                                <TableCell style={{ width: 212 }} align="left" className='table_data'>
                                                    {customizeDateFormate(row.createdAt)}
                                                </TableCell>
                                                <TableCell style={{ width: 165, textTransform: 'capitalize' }} align="left" className='table_data'>
                                                    {row.Details?.paymentMode ? row.Details?.paymentMode : 'Free'}
                                                </TableCell>
                                                <TableCell style={{ width: 160, textTransform: 'capitalize' }} align="left" className='table_data'>
                                                    {row.paymentStatus == 'paid' ?
                                                        <div className='status_btn active'>{row.paymentStatus}</div> : (row.Details?.paymentMode != 'cash') ?
                                                            <div className='text-center'>Free</div> :
                                                            <div className="xs_switch">
                                                                <input
                                                                    id={'paymentChk_' + i}
                                                                    type="checkbox"

                                                                    value={row.paymentStatus == "paid" ? 1 : 0}
                                                                    defaultChecked={row.paymentStatus == "paid" ? true : false}
                                                                    onChange={(e) => { setPayStatusPopUp({ id: row._id, show: true }) }}
                                                                />
                                                                <label htmlFor={'paymentChk_' + i}>
                                                                    <span className="xs_switch_icon"></span>
                                                                    <span className="xs_switch_text">{row.paymentStatus == "paid" ? 'paid' : 'unpaid'}</span>
                                                                </label>
                                                            </div>
                                                    }
                                                </TableCell>
                                                {(campaign_Type == 'appointment') && <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                                    <div className="xs_switch">
                                                        {(row.status == 1) && <input
                                                            id={'userChk_' + i}
                                                            type="checkbox"
                                                            disabled={(row.status == 0) ? true : false}
                                                            value={row.status == 1 ? 1 : 0}
                                                            defaultChecked={row.status == 1 ? true : false}
                                                            onChange={(e) => { if ((e.target.checked == false) && !isAppointmentInPast(row.appointmentDate)) { setDeclinePopup(true); setStatusId(row._id); setUserDetail(row) } }}
                                                        />}
                                                        <label htmlFor={'userChk_' + i}>
                                                            <span className="xs_switch_icon"></span>
                                                            <span className="xs_switch_text">{row.status == 1 ? 'Accepted' : 'Declined'}</span>
                                                        </label>
                                                    </div>
                                                </TableCell>}
                                                <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                                    <div className='table_action_wrap'>
                                                        <Tooltip title="View Details" placement="top" arrow>
                                                            <div className="action_edit" onClick={() => { setUserDetailPopUp(true); setUserDetail(row.Details) }}>{svg.preview}</div>
                                                        </Tooltip>
                                                        <Tooltip title={!deleteDisableCheck(row) ? "" : "Delete"} placement="top" arrow>
                                                            <button className={`action_delete ${!deleteDisableCheck(row) && 'disable_btn'}`} disabled={!deleteDisableCheck(row)} onClick={()=>setDeleteStore({showPopUp:true,deleteID:row._id})}>{svg.delete}</button>
                                                        </Tooltip>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}

                                </TableBody>
                                <TableFooter>

                                    {!loading ? (registrationList.length == 0) ? null : <TableRow >
                                        <TablePagination className='table_footer'
                                            rowsPerPageOptions={[10, 25, 50, 100]}
                                            colSpan={8}
                                            count={count}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            SelectProps={{
                                                inputProps: {
                                                    'aria-label': 'rows per page',
                                                },
                                                native: true,
                                            }}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                            ActionsComponent={TablePaginationActions}
                                        />
                                    </TableRow> : null}

                                </TableFooter>
                            </>

                        </Table>
                    </TableContainer>
                    {!loading && (registrationList.length == 0) ? (
                        <div className='empty_box'><span>{svg.empty_record}</span>
                            <p className='empty_p'>  No registrations found for this campaign type.</p>
                        </div>

                    ) : ''}
                </div>
            </div>

            <div ref={FilterRef} className={`filter_sidebar ${filterShow ? 'filter_show' : ''}`}>
                <div className='filter_heading'><span onClick={() => setFilterShow(!filterShow)}>{svg.filter}</span> Filters</div>
                <div>
                    <div className={styles.filter_select}>
                        <Form fieldname='campaign_name' isRequired={false} label="Campaign Name" inputType='select' control={control} options={campaignList} errors={errors} />
                        {getValues('campaign_name') && <span className={styles.clear_select} onClick={(e) => { setValue('campaign_name', '') }}>x</span>}
                    </div>

                    <Form fieldname={'filter_pay_method'} label={`Payment Method`} inputType={"radio"} options={[{ label: 'Stripe', value: 'stripe' }, { label: "Paypal", value: 'paypal' }, { label: 'Cash', value: 'cash' }, { label: 'Free', value: 'free' }]} control={control} errors={errors} isRequired={false} />

                    <div className="input_wrapper">
                        <label>Search By User</label>
                        <input type='text' className="input" placeholder={`Search by user`} value={userFilter} onChange={(e) => setUserFilter(e.target.value)} onKeyUp={handleUserSearchKeyupEvent} />
                        {userFilter ?
                            <span className="search_clear" onClick={(e) => clearUserFilter(e)}>x</span>
                            : null
                        }
                    </div>

                    <Form fieldname={'filter_pay_status'} label={`Payment Status`} inputType={"radio"} options={[{ label: 'All', value: '', color: '#DD1047' }, { label: "Paid", value: 'paid', color: '#11CF01' }, { label: 'Unpaid', value: 'unpaid', color: '#F29201' }]} control={control} errors={errors} isRequired={false} />

                    {(campaign_Type == 'appointment') && <>
                        <div className={styles.filter_select}>
                            <Form fieldname='appointment_status' isRequired={false} label="Appointment Status" inputType='select' control={control} options={[{ label: 'Accepted', value: 'accepted' }, { label: 'Declined', value: 'declined' }]} errors={errors} />
                            {getValues('appointment_status') && <span className={styles.clear_select} onClick={(e) => { setValue('appointment_status', ''); }}>x</span>}
                        </div>
                        <Form label="Appointment Date" fieldname={`filter_date`} inputType='daterangepicker' placeholder="Appointment Date" control={control} errors={errors} isDisable={false} isRequired={false} disbaleDate={false} dateClean={dateClean} />
                    </>
                    }
                    {(campaign_Type == 'booking') && <Form label="Booking Date" fieldname={`filter_date`} inputType='daterangepicker' placeholder="Booking Date" control={control} errors={errors} isDisable={false} isRequired={false} disbaleDate={false} dateClean={dateClean} />
                    }
                </div>
            </div>

            {/* User detail display PopUp */}
            <Popup
                show={userDetailPopUp}
                onClose={PopupCloseHandler}
                maxWidth={'800px'}
            >
                <div className={styles.detail_wrapper}>
                    <h2 className={`${styles.heading_detail} rtl_center`}>User Details</h2>
                    <div className={styles.details_upper_wrap}>
                        <div className={styles.form_detail}>
                            {
                                (userDetail.userInfo) && Object.keys(userDetail.userInfo).map((val, i) => (<div key={i} className={styles.userInfo_box}><div>{val} : </div><span>{userDetail.userInfo[val]}</span></div>))
                            }
                        </div>
                        {
                            (campaign_Type == "appointment") && <div className={styles.other_detail}>
                                <div className={styles.userInfo_box}><div> Appointment Date :</div> <span>{customizeDateFormate(userDetail.appointmentDate)}</span></div>
                                <div className={styles.userInfo_box}><div>Time slot :</div> <span> {new Date(`2000-01-01 ${userDetail.slotTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
                                {(userDetail.paymentMode != undefined || userDetail.paymentMode) && <div className={styles.userInfo_box} style={{ textTransform: 'capitalize' }}><div>Payment Mode :</div> <span>{userDetail.paymentMode}</span></div>}
                                {(userDetail.staff != undefined || userDetail.staff) && <div className={styles.userInfo_box} ><div>Staff : </div>  <span>{customizeId(userDetail.staff)}</span></div>}
                                {(userDetail?.amount) && <div className={styles.userInfo_box}><div>Amount :</div> <span>{userDetail.paymentMode == "cash" ? widgetCurrency[userDetail.currency] : widgetCurrency[(userDetail?.paymentInvoice?.currency.toLowerCase())]} {userDetail.amount}</span></div>}
                            </div>
                        }
                        {
                            (campaign_Type == "event") && <div className={styles.other_detail}>
                                {(userDetail.paymentMode) && <div className={styles.userInfo_box} style={{ textTransform: 'capitalize' }}><div>Payment Mode :</div> <span> {userDetail.paymentMode}</span></div>}
                                {(userDetail.paymentMode == 'cash') && <div className={styles.userInfo_box}><div>Amount :</div> <span>{userDetail.paymentMode == "cash" ? widgetCurrency[userDetail.currency] : widgetCurrency[(userDetail?.paymentInvoice?.currency.toLowerCase())]} {userDetail?.amount}</span></div>}
                            </div>
                        }
                        {
                            (campaign_Type == "booking") && <div className={styles.other_detail}>
                                {(userDetail.bookingDate != undefined || userDetail.bookingDate) ? <div className={styles.userInfo_box}> <div>Booking Date : </div><span> {customizeDateFormate(userDetail.bookingDate)} </span></div>
                                    : <>
                                        <div className={styles.userInfo_box}> <div>CheckIn Date : </div><span> {customizeDateFormate(userDetail.Checkindate)} </span></div>
                                        <div className={styles.userInfo_box}> <div>CheckOut Date : </div><span> {customizeDateFormate(userDetail.Checkoutdate)} </span></div>
                                    </>}
                                {(userDetail.bookingType != undefined || userDetail.bookingType) && <div className={styles.userInfo_box}><div>Time slot :</div> <span>{new Date(`2000-01-01 ${userDetail.slotTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span> </div>}
                                <div className={styles.userInfo_box} style={{ textTransform: 'capitalize' }}><div>Payment Mode : </div><span>  {userDetail.paymentMode}</span> </div>
                                <div className={styles.userInfo_box} ><div>Booking Type :</div> <span> {(userDetail.bookingType != undefined || userDetail.bookingType) ? userDetail.bookingType : 'room'}</span></div>
                            </div>
                        }




                    </div>

                    {(campaign_Type != "appointment") && <div className={styles.table_conatiner}>
                        <table className={styles.table} id="detail_table">
                            <thead>
                                <tr>
                                    <th>Selected</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    userDetail?.selectedRecords && Object.keys(userDetail?.selectedRecords).map((key) => (
                                        <tr key={key}>
                                            <td>{key}</td>
                                            <td>{userDetail?.selectedRecords[key].selectCount}</td>
                                            <td>{userDetail.paymentMode == "cash" ? widgetCurrency[userDetail.currency] : widgetCurrency[(userDetail?.paymentInvoice?.currency.toLowerCase())]} {userDetail?.selectedRecords[key].price}</td>
                                            <td>{userDetail.paymentMode == "cash" ? widgetCurrency[userDetail.currency] : widgetCurrency[(userDetail?.paymentInvoice?.currency.toLowerCase())]}{userDetail?.selectedRecords[key].selectCount * userDetail?.selectedRecords[key].price}</td>
                                        </tr>
                                    ))

                                }

                            </tbody>
                        </table>
                    </div>}

                    {(userDetail.paymentMode != 'cash' && userDetail.registrationType != "free") ? <div>
                        <h3>Payment Details</h3>
                        <div>
                            <div className={styles.userInfo_box}><div>Transaction Id : </div><span>{userDetail.paymentMode == "stripe" ? userDetail?.paymentInvoice?.invoiceNumber : userDetail?.paymentInvoice?.transactionId}</span></div>
                            <div className={styles.userInfo_box}><div>Bill To : </div><span>{userDetail?.paymentInvoice?.email}</span></div>
                            <div className={styles.userInfo_box}><div>Payment  date : </div><span>{userDetail.paymentMode == "stripe" ? customizeDateFormate(userDetail?.paymentInvoice?.paymentDate, 'DD-MM-YYYY') : customizeDateFormate(userDetail?.paymentInvoice?.paymentDate)}</span></div>
                            <div className={styles.userInfo_box}><div>Amount : </div><span>{widgetCurrency[(userDetail?.paymentInvoice?.currency.toLowerCase())]} {userDetail?.paymentInvoice?.price}</span></div>
                            <div className={styles.userInfo_box} style={{ textTransform: 'capitalize' }}><div>Payment Status : </div><span>{userDetail?.paymentInvoice?.status.toUpperCase()}</span></div>

                        </div>
                    </div> : (userDetail.registrationType != "free" && userDetail?.paymentDate) && <div>
                        <h3>Payment Details</h3>
                        <div>
                            {(userDetail?.paymentDate) && <div className={styles.userInfo_box}><div>Payment  date : </div><span>{customizeDateFormate(userDetail.paymentDate)}</span></div>}
                            {(userDetail?.paymentTime) && <div className={styles.userInfo_box}><div>Payment  Time : </div><span>{(new Date(userDetail.paymentTime)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>}
                            {(userDetail?.paymentRemark) && <div className={styles.userInfo_box}><div>Remark : </div><span>{userDetail.paymentRemark}</span></div>}
                        </div>
                    </div>
                    }

                </div>
            </Popup>

            {/* Appointment decline reason PopUP */}
            <Popup
                show={declinePopUp}
                onClose={() => DeclinePopupCloseHandler('decline')}
                maxWidth={'522px'}
            >
                <form onSubmit={handleSubmit1(onSubmit)}>

                    <Form fieldname='reason' label='Reason For Decline' inputType='textarea' register={register} errors={errors} isRequired={true} />

                    <button type='submit' className='ap_btn'>Submit</button>
                </form>
            </Popup>

            {/* Payment Status update details PopUp */}
            <Popup
                show={payStatusPopUp.show}
                onClose={() => DeclinePopupCloseHandler('payment')}
                maxWidth={'522px'}
            >
                <form onSubmit={handleSubmit2(paymentStatusHandle)}>


                    <Form dateFormate="dd-MM-yyyy" label="Payment Date" disbaleDate={false} fieldname={`pay_date`} inputType='datepicker' placeholder="Payment date" control={control1} errors={errors1} isRequired={true} />
                    <Form dateFormate="HH:mm" label="Payment Time" fieldname={`pay_time`} disbaleDate={true} inputType='datepicker' placeholder="Payment time" control={control1} errors={errors1} isDisable={false} isRequired={true} dateclass='w-100' />
                    <Form fieldname='pay_remark' label='Remark' inputType='text' register={register1} errors={errors1} applyValidation={false} isRequired={true} />

                    <div className='text-left'>
                        <button type='submit' className='ap_btn'>Submit{btnLoader ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : ''}</button>
                    </div>
                </form>
            </Popup>
            
            <Popup
                heading={"Move To Trash"}
                show={deleteStore.showPopUp}
                type="delete"
                maxWidth={'440px'}
                onClose={()=>setDeleteStore({showPopUp:false,deleteID:''})}
            >
                <ConfirmDeletePopup handlePopUp={handleDeletePopUp} title="" />
            </Popup>
        </div>
    )
}

export default page


