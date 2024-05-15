"use client"
import PageTitle from '@/app/components/common/PageTitle'
import svg from '@/utils/svg';
import { Box, CircularProgress, Tooltip } from '@mui/material'
import { useState, useEffect, Suspense } from 'react';
import { Table, TableHead, Paper, TableRow, Skeleton, Button, TableCell, TableBody, TablePagination, TableFooter, TableContainer } from '@mui/material';
import { callAPI } from '@/utils/API'
import Popup from '@/app/components/popup/popup';
import ConfirmDeletePopup from '@/app/components/popup/deleteConfirm';
import { TablePaginationActions } from '@/app/components/common/TablePagination';
import { Form } from '@/utils/formValidator';
import { useForm } from "react-hook-form";
import DatatableLoader from '@/app/components/loader/DatatableLoader';
import Link from 'next/link';


function page() {

    const { register, handleSubmit, control, formState: { errors }, reset, setError, watch } = useForm({
        defaultValues: {
            status: 'Active',
            plan: ''
        }
    });

    const [userid, setuserId] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [userList, setUserList] = useState([]);
    const [DeleteId, setDeleteId] = useState();
    const [showPopUp, setShowPopup] = useState(false);
    const [editUser, setEditUser] = useState({});
    const [showEditPopUp, setShowEditPopUp] = useState(false);
    const [isEdit, setisEdit] = useState(false);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true)
    const [btnLoader, setBtnLoader] = useState(false)
    const [searchTerm, setSearchTerm] = useState('');
    const [planslist, setplanslist] = useState([]);
    const [hasCentralSmtpAcc, setHasCentralSmtpAcc] = useState(false);
    const [detailPlanList, setDetailPlanList] = useState([]);
    const [isPlanDeactive, setIsPlanDeactive] = useState(false);


    let clearSearch = (e) => {
        setSearchTerm('');
        fetchUser('')
    }

    const handleSearchKeyupEvent = async (e) => {
        let t = e.target;
        let searchTerm = t.value;
        setSearchTerm(searchTerm);

        if (e.keyCode === 13) {
            fetchUser(searchTerm)
        }
    }

    const centralSMTPDetail = () => {
        callAPI({
            method: 'PATCH',
            url: 'common'
        }, (data) => {
            if (data.data.smtpDetails) {
                setHasCentralSmtpAcc(true);
            }
        })
    }
    useEffect(() => {
        centralSMTPDetail();
        fetchPlans();
    }, [])

    useEffect(() => {
        fetchUser();
    }, [page, rowsPerPage])


    const fetchUser = (search = searchTerm, pageNo = page, row = rowsPerPage) => {
        setLoading(true)

        callAPI({
            method: 'POST',
            url: '/admin/users',
            data: {
                search: search,
                page: pageNo + 1,
                listPerPage: row
            },
        }, (resp) => {
            if (resp.status == 1) {
                setUserList(resp.users)
                setCount(resp.totalRecords)
                setLoading(false)
            }

        })
    }

    const fetchPlans = () => {
        callAPI({
            method: 'GET',
            url: '/admin/plan',
        }, (resp) => {
            setDetailPlanList(resp.planlist);
            const list = (resp.planlist) .filter(plan => plan.status == 1).map(plan => ({
                label: plan.planname,
                value: plan._id
            }))
            setplanslist(list)
        })
    }



    const handleChangePage = (event, newPage) => {
        fetchUser(searchTerm, newPage, rowsPerPage)
        setPage(newPage);


    };

    const handleChangeRowsPerPage = (event) => {
        fetchUser(searchTerm, page, parseInt(event.target.value, 10))
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };



    // Create user
    const createUser = () => {
        setIsPlanDeactive(false)
        setShowEditPopUp(true)
        setisEdit(false);
        reset({
            firstname: '',
            lastname: '',
            password: '',
            plan: '',
            email: '',
            status: '',
        });
        setEditUser('')
    }
    const onSubmitCreate = (newuser) => {
        if (newuser.sendemail && !hasCentralSmtpAcc) {
            setError(`sendemail`, { type: "custom", message: "Add central smtp email account." });
        } else {
            setBtnLoader(true)
            callAPI({
                method: 'POST',
                url: `auth/register`,
                data: newuser
            }, (res) => {
                setBtnLoader(false)
                if (res.status == 1) {
                    setEditUser('')
                    reset();
                    fetchUser();
                }
                setShowEditPopUp(false);
            });
        }
    }

    // User  Edit function
    const userEdit = (data ,id) => { 
        setIsPlanDeactive(false);
        if(data.plan)
        {
            setIsPlanDeactive(true);
        }
        setShowEditPopUp(true);
        setisEdit(true);
        setEditUser(data)
        reset({
            firstname: data.firstname,
            lastname: data.lastname,
            plan: data.plan && id,
            isPaymentRequired:(data.isPaymentRequired == 0) ? false : true,
            email: data.email,
            status: data.status
        });
        setuserId(data._id);
    }

    const onSubmitUpdate = (updatedvalues) => {
        setBtnLoader(true)
        const newupdates = {
            firstname: updatedvalues.firstname,
            lastname: updatedvalues.lastname,
            email: updatedvalues.email,
            status: updatedvalues.status,
            plan: updatedvalues.plan,
        }
        if (updatedvalues.password) {
            newupdates.password = updatedvalues.password;
        }
        if (updatedvalues.plan) {
            newupdates.isPaymentRequired = updatedvalues.isPaymentRequired ? 1 : 0;
        }
        callAPI({
            method: 'PUT',
            url: `common?id=${userid}`,
            data: newupdates
        }, (res) => {
            setBtnLoader(false);
            setShowEditPopUp(false);
            if (res.status == 1) {
                fetchUser();
                reset();
            }
        });
    }

    // User move to trash function
    const deleteUser = (id) => {
        if (id) {
            callAPI({
                method: 'GET',
                url: `common/trash?id=${id}&type=user`,
            }, (resp) => {
                if (resp.status == 1) {
                    setShowPopup(false);
                    fetchUser();
                }
            })
        }
    }

    const handleDelete = (id) => {
        setShowPopup(true);
        setDeleteId(id);
    }

    const handlePopUp = (val) => {
        if (val) {
            deleteUser(DeleteId);
        }
        setShowPopup(false);
    }

    const deletePopupCloseHandler = () => { setDeleteId(''); setShowPopup(false); }


    const PopupCloseHandler = (val) => {
        setShowEditPopUp(val);
        fetchUser();
    }

    return (
        <div>
            <PageTitle title="User" />
            <div className='content_wrapper'>
                <div className='box_wrap'>
                    <Box className="search_wrapper">
                        <span className="search_icon">{svg.search}</span>
                        <input type="text" placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyUp={handleSearchKeyupEvent} />
                        {searchTerm ?
                            <span className="search_clear" onClick={(e) => clearSearch(e)}>x</span>
                            : null
                        }
                    </Box>

                    <div>
                        <button className='ap_btn' onClick={() => createUser()}>Add New</button>
                    </div>

                </div>

                <div className='datatable_wrap'>

                    <Suspense >
                       <TableContainer component={Paper} className='table_container'>
                            <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                                {(userList.length == 0 && !loading) ? null : <TableHead className='table_head'>
                                    <TableRow>
                                        <TableCell className='table_head'>S.No</TableCell>
                                        <TableCell align="left" className='table_head'>Name</TableCell>
                                        <TableCell align="left" className='table_head'>Email</TableCell>
                                        <TableCell align="left" className='table_head'>Status</TableCell>
                                        <TableCell align="left" className='table_head'>Plan</TableCell>
                                        <TableCell align="left" className='table_head'>Actions</TableCell>

                                    </TableRow>
                                </TableHead>}

                                <>
                                    <TableBody className='table_body'>

                                        {loading && detailPlanList.length == 0 ? <TableRow><TableCell align="center" className='table_data' colSpan={6}><DatatableLoader /></TableCell></TableRow>
                                            :
                                            userList.map((row, i) => {
                                                let obj = {};
                                                obj = detailPlanList.find(val => {
                                                    return (val?._id === row.plan || val?.paypal?.planId === row.plan || val?.stripe?.planId === row.plan);
                                                  });
                               
                                                return (
                                                    <TableRow key={row._id} className='table_row'>
                                                        <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                                            {(rowsPerPage * page) + (i + 1)}
                                                        </TableCell>
                                                        <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                                            <span> {row.firstname} {row.lastname}</span>

                                                        </TableCell>
                                                        <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                                            {row.email}
                                                        </TableCell>
                                                        <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                                            <div className='datatable_status'> 
                                                            {row.status == 'Active' ?
                                                                <div className='status_btn active'>{row.status}</div> :
                                                                <div className='status_btn inactive'>{row.status}</div>
                                                            }
                                                            </div>
                                                        </TableCell>
                                                        <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                                            {row.plan ? obj?.planname : '-'}
                                                        </TableCell>
                                                        <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                                            <div className='table_action_wrap'>

                                                                <Tooltip title="Edit" placement="top" arrow>
                                                                    <div className="action_edit" onClick={() =>userEdit(row ,obj?._id)}>{svg.edit}</div>
                                                                </Tooltip>
                                                                <Tooltip title="Delete" placement="top" arrow>
                                                                    <div className="action_delete" onClick={() => handleDelete(row._id)}>{svg.delete}</div>
                                                                </Tooltip>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            }
                                            )}


                                    </TableBody>
                                    {!loading && (userList.length == 0) ? null : <TableFooter>
                                        <TableRow >
                                            <TablePagination className='table_footer'
                                                rowsPerPageOptions={[10, 25, 50, 100]}
                                                colSpan={6}
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
                                        </TableRow>
                                    </TableFooter>}
                                </>

                            </Table>
                        </TableContainer>


                    </Suspense>
                    {!loading && (userList.length == 0) ? (<div className='empty_box'><span>{svg.empty_record}</span>
                        <p className='empty_p'>{searchTerm ? 'You do not have user with this name.'    :  'There are no records to display.' }</p>
                    </div>) : ''}

                </div>

            </div>


            <Popup
                show={showEditPopUp}
                onClose={PopupCloseHandler}
            >
                <form onSubmit={isEdit ? handleSubmit(onSubmitUpdate) : handleSubmit(onSubmitCreate)} >
                    <div className='input_wrapper_list'>
                        <Form fieldname='firstname' label='First Name' inputType='text' register={register} errors={errors} applyValidation={true} isRequired={true} />
                        <Form fieldname='lastname' label='Last Name' inputType='text' register={register} errors={errors} applyValidation={true} isRequired={true} />

                    </div>
                    <div className='input_wrapper_list'>
                        <Form fieldname='email' label='Email' inputType='email' register={register} isRequired={true} errors={errors} isDisable={isEdit ? true : false} />
                        <Form inputType={'password'} fieldname={'password'} label={'Password'} register={register} errors={errors} isRequired={isEdit ? false : true} />
                    </div>

                    <div className='input_wrapper_list margin_low'>
                        <Form fieldname='plan' isRequired={false} label="Plan" inputType='select' isDisable={isPlanDeactive ? true : false} control={control} options={planslist} errors={errors} />
                        <Form fieldname='status' isRequired={true} label="Status" inputType='select' control={control} options={[{ label: 'Active', value: 'Active' }, { label: 'Inactive', value: 'Inactive' }]} errors={errors} />
                    </div>
                    {watch('plan') && <Form fieldname={'isPaymentRequired'} inputType={'checkbox'} label={'Is payment required for this plan ?'} control={control} />}

                    {isEdit ? null : <div className='input_wrapper'>
                        <Form fieldname={'sendemail'} inputType={'checkbox'} label={'Send Email'} control={control} />
                        {(errors.sendemail) && <span className='error'>{errors?.sendemail?.message}</span>}
                        {(watch('sendemail')) && ((!hasCentralSmtpAcc) && <div className='create_SMTPacc_mes'>Currently no account added. Please add central smtp  account by clicking <Link href={`${process.env.APP_URL}/admin/settings`}>here</Link> </div>)}
                    </div>}

                    <div className="text-center">
                        <button type="submit" className="ap_btn ap_btn_full" disabled={btnLoader} >{isEdit ? "Update User" : "Add User"}
                            {btnLoader ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : ''}
                        </button>
                    </div>
                </form>

            </Popup>

            <Popup
                heading={"Move To Trash"}
                show={showPopUp}
                type="delete"
                maxWidth={'440px'}
                onClose={deletePopupCloseHandler}
            >
                <ConfirmDeletePopup handlePopUp={handlePopUp} title=" parmanently" />
            </Popup>

        </div >
    )
}

export default page
