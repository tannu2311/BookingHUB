"use client"
import PageTitle from '@/app/components/common/PageTitle'
import svg from '@/utils/svg';
import { Box, Tooltip } from '@mui/material'
import { useState, useEffect, Suspense } from 'react';
import { Table, TableHead, Paper, TableRow, Button, TableCell, TableBody, TableContainer } from '@mui/material';
import { callAPI } from '@/utils/API'
import Popup from '@/app/components/popup/popup';
import ConfirmDeletePopup from '@/app/components/popup/deleteConfirm';
import { Form } from '@/utils/formValidator';
import { useForm } from "react-hook-form";
import { CircularProgress } from '@mui/material';
import DatatableLoader from '@/app/components/loader/DatatableLoader';

function page() {

    const { register, handleSubmit, control, formState: { errors }, reset, watch } = useForm({
        defaultValues: {
            paymentPeriod: '',
        },
    });

    const [showEditPopUp, setShowEditPopUp] = useState(false);
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('');
    const [planslist, setplanslist] = useState([]);
    const [btnLoader, setBtnLoader] = useState(false)

    const fetchPlans = (search = searchTerm) => {
        callAPI({
            method: 'GET',
            url: `/admin/plan?search=${search}`,
        }, (resp) => {
            setLoading(false)
            setplanslist(resp.planlist)
        })
    }

    useEffect(() => {
        fetchPlans();
    }, [])

    let clearSearch = (e) => {
        setSearchTerm('');
        fetchPlans('');
    }

    const handleSearchKeyupEvent = async (e) => {
        let t = e.target;
        let searchTerm = t.value;
        setSearchTerm(searchTerm);

        if (e.keyCode === 13) {
            fetchPlans(searchTerm)
        }
    }

    function createData(id, name, description, noOfCampaigns, price, paymentPeriod, allowFreeTrial, freeTrialPeriod, status) {
        return { id, name, description, noOfCampaigns, price, paymentPeriod, allowFreeTrial, freeTrialPeriod, status };
    }

    const rows = planslist.map((val) => createData(val._id, val.planname, val.description, val.noOfCampaigns, val.price, val.paymentPeriod, val.allowFreeTrial, val.freeTrialPeriod, val.status),
    );




    // Create user
    const createPlan = () => {
        setShowEditPopUp(true)
        reset({
            planname: '',
            price: '',
            description: '',
            noOfCampaigns: '',
            paymentPeriod: '',
            allowFreeTrial: false,
            freeTrialPeriod: '',
            isRecommended:false
        });
    }
    const onSubmitCreate = (newplan) => {

        if (!newplan.allowFreeTrial) {
            delete newplan.freeTrialPeriod;
        }
        newplan.status = 1;
        setBtnLoader(true)
        callAPI({
            method: 'POST',
            url: `admin/plan`,
            data: newplan
        }, (res) => {
            setBtnLoader(false)
            setShowEditPopUp(false)
            if (res.status == 1) {
                reset();
                fetchPlans();
            }
        });
    }


    const PopupCloseHandler = (val) => {
        setShowEditPopUp(val);
        fetchPlans();
    }

    const handleStatusUpdate = (status, id) => {
        if (id) {
            callAPI({
                method: 'PUT',
                url: `/admin/plan`,
                data: { status, id }
            }, (resp) => {
                if (resp.status == 1) {
                    fetchPlans();
                }
            })
        }
    }

    return (
        <div>
            <PageTitle title="Plans" />
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
                        <button className='ap_btn' onClick={() => createPlan()}>Add New</button>
                    </div>


                </div>
                <div className='datatable_wrap'>

                    <Suspense >

                        <TableContainer component={Paper} className='table_container'>
                            <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                                {(rows.length == 0 && !loading) ? null : <TableHead className='table_head'>
                                    <TableRow>
                                        <TableCell className='table_head'>S.No</TableCell>
                                        <TableCell align="left" className='table_head'>Name</TableCell>
                                        <TableCell align="left" className='table_head'>Description</TableCell>
                                        <TableCell align="left" className='table_head'>Number Of Campaign</TableCell>
                                        <TableCell align="left" className='table_head'>Payment Period</TableCell>
                                        <TableCell align="left" className='table_head'>Price</TableCell>
                                        <TableCell align="left" className='table_head'>Allow free Trial</TableCell>
                                        <TableCell align="left" className='table_head'>Free Trial Days</TableCell>
                                        <TableCell align="left" className='table_head'>Status</TableCell>
                                       
                                    </TableRow>
                                </TableHead>}

                                <>
                                    <TableBody className='table_body'>
                                        {loading ? <TableRow><TableCell align="center" className='table_data' colSpan={10}><DatatableLoader /></TableCell></TableRow>
                                            :
                                            rows.map((row, i) => (
                                                <TableRow key={row.id} className='table_row'>
                                                    <TableCell style={{ width: 60 }} align="left" className='table_data'>
                                                        {i + 1}
                                                    </TableCell>
                                                    <TableCell style={{ width: 100 }} align="left" className='table_data'>
                                                        <span> {row.name}</span>

                                                    </TableCell>
                                                    <TableCell style={{ width: 160 }} align="left" className='table_data'>

                                                        {row?.description.length > 20 ? <Tooltip title={row.description} placement="top" arrow>  {`${row.description.slice(0, 20)}...`} </Tooltip> : row.description}

                                                    </TableCell>
                                                    <TableCell style={{ width: 200 }} align="center" className='table_data'>
                                                        {row?.noOfCampaigns ? row.noOfCampaigns : '-'}
                                                    </TableCell>
                                                    <TableCell style={{ width: 160 }} align="left" className='table_data'>

                                                        {row.paymentPeriod}

                                                    </TableCell>
                                                    <TableCell style={{ width: 100 }} align="left" className='table_data'>
                                                        ₹ {row.price}
                                                    </TableCell>
                                                    <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                                        <div className='datatable_status'>
                                                        {row.allowFreeTrial ?
                                                            <div className='status_btn active'>Allow</div> :
                                                            <div className='status_btn inactive'>Not-Allow</div>
                                                        }
                                                         </div>
                                                    </TableCell>
                                                    <TableCell style={{ width: 160 }} align="center" className='table_data'>
                                                        {row.allowFreeTrial ? row.freeTrialPeriod : 'NA'}
                                                    </TableCell>
                                                    <TableCell style={{ width: 160 }} align="left" className='table_data'>

                                                        <div className="xs_switch">

                                                            <input
                                                                id={'userChk_' + i}
                                                                type="checkbox"
                                                                value={row?.status == 1 ? 1 : 0}
                                                                defaultChecked={row?.status == 1 ? true : false}
                                                                onChange={(e) => handleStatusUpdate(!row?.status, row.id)}
                                                            />

                                                            <label htmlFor={'userChk_' + i}>
                                                                <span className="xs_switch_icon"></span>
                                                                <span className="xs_switch_text">{row.status == 1 ? 'Active' : 'Inactive'}</span>
                                                            </label>
                                                        </div>
                                                    </TableCell>

                                                </TableRow>
                                            ))}


                                    </TableBody>
                                </>

                            </Table>
                        </TableContainer>


                    </Suspense>
                    {!loading && (planslist.length == 0) ? (<div className='empty_box'><span>{svg.empty_record}</span>
                        <p className='empty_p'> {searchTerm ? 'You do not have plan with this name'    : 'There are no records to display.'}</p>
                    </div>) : ''}
                </div>
            </div>


            <Popup
                show={showEditPopUp}
                onClose={PopupCloseHandler}
            >
                <form onSubmit={handleSubmit(onSubmitCreate)} >
                    <div className='input_wrapper_list'>
                        <Form fieldname='planname' isRequired={true} label='Plan Name' inputType='text' register={register} errors={errors} applyValidation={false} />
                        <Form fieldname="paymentPeriod" label={"Payment Period"} inputType={"select"} options={[{ label: 'Monthly', value: 'MONTH' }, { label: 'Yearly', value: 'YEAR' }]} control={control} errors={errors} />
                    </div>
                    <div className='input_wrapper_list'>
                        <Form fieldname='price' label='Price' inputType='number' register={register} errors={errors} isRequired={true} />
                        <Form fieldname='noOfCampaigns' label='Number Of Campaign' inputType='number' register={register} errors={errors} isRequired={true} />
                    </div>



                    <div className='input_wrapper_list'>

                        <Form fieldname='description' label='Description' inputType='textarea' register={register} errors={errors} isRequired={true} />
                        <div className="input_wrapper">
                            <Form fieldname={'allowFreeTrial'} inputType={'checkbox'} label={'Allow Free Trial'} control={control} />

                            {watch('allowFreeTrial') && (
                                <Form fieldname='freeTrialPeriod' label='Free Trial Period (In Days)' inputType='number' register={register} errors={errors} />
                            )}
                        </div>
                    </div>
                    <div className="input_wrapper">
                            <Form fieldname={'isRecommended'} inputType={'checkbox'} label={'Add Label \"Recommended\"'} control={control} />
                   </div>

                    <div className="text-center">
                        <button type="submit" className="ap_btn ap_btn_full" disabled={btnLoader}  >{"Add Plan"}
                            {btnLoader ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : ''}
                        </button>
                    </div>
                </form>

            </Popup>

        </div >
    )
}

export default page