"use client"
import PageTitle from '@/app/components/common/PageTitle'
import svg from '@/utils/svg';
import { Alert, Box, CircularProgress, Tooltip } from '@mui/material'
import { useState, useEffect, Suspense } from 'react';
import { Table, TableHead, Paper, TableRow, TableCell, TableBody, TablePagination, TableFooter, TableContainer } from '@mui/material';
import { callAPI } from '@/utils/API'
import Popup from '@/app/components/popup/popup';
import ConfirmDeletePopup from '@/app/components/popup/deleteConfirm';
import { TablePaginationActions } from '@/app/components/common/TablePagination';
import DatatableLoader from '@/app/components/loader/DatatableLoader';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { setCampaignID } from '@/app/redux/commonSlice';
import { widgetCurrency } from '@/utils/data';


function page() {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [campaignList, setCampaignList] = useState([]);
    const [DeleteId, setDeleteId] = useState();
    const [showPopUp, setShowPopup] = useState(false);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('');
    const [copied, setCopied] = useState(false);
    const [widgetPopup, setwidgetPopup] = useState(false);
    const [campData, setcampData] = useState({});
    const [userCampaignCount, setuserCampaignCount] = useState(0);
    const campaignWidgetId = useSelector((store) => store.storeData.common.campaignWidgetId)
    const user = useSelector((store) => store.storeData?.auth?.user);

    const dispatch = useDispatch();

    const showPreview = (campid, campType) => {
        let url = `${process.env.APP_URL}/widget_preview.html?cid=${campid}&ctype=${campType}`
        window.open(url);
    }

    useEffect(() => {
        if (campaignWidgetId) {
            if (Object.keys(campaignWidgetId).length !== 0) {
                setwidgetPopup(true);
                setcampData(campaignWidgetId);
            }
        }
    });

    const copyToClipboard = () => {

        const textToCopy = `<script src=${`${process.env.APP_URL}/widget-form.js`}></script>
        <div class="bookinghub" data-campaign="${campData.campid}" data-camp-type="${campData.campType}"></div> `;

        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        });
    };

    const PopupCloseHandler = () => {
        setwidgetPopup(false)
        dispatch(setCampaignID({}));
    }

    const handleCopyPopUp = (campid, campType) => {
        setcampData({ campid, campType })
        setwidgetPopup(true);
    }

    let clearSearch = (e) => {
        setSearchTerm('');
        fetchCampaign('')
    }

    const handleSearchKeyupEvent = async (e) => {
        let t = e.target;
        let searchTerm = t.value;
        setSearchTerm(searchTerm);

        if (e.keyCode === 13) {
            fetchCampaign(searchTerm)
        }
    }

    useEffect(() => {
        fetchCampaign()
    }, [page, rowsPerPage])


    const fetchCampaign = (search = searchTerm, pageNo = page, row = rowsPerPage) => {
        setLoading(true)

        callAPI({
            method: 'GET',
            url: `/user/campaign?search=${search}&page=${pageNo + 1}&row=${row}`,
        }, (resp) => {
            if (resp.status == 1) {
                setCampaignList(resp.campaignslist)
                setCount(resp.totalRecords);
                setuserCampaignCount(resp.userCampaignCount)
            }
            setLoading(false)
        })
    }

    const handleChangePage = (event, newPage) => {
        fetchCampaign(searchTerm, newPage, rowsPerPage)
        setPage(newPage);

    };

    const handleChangeRowsPerPage = (event) => {
        fetchCampaign(searchTerm, page, parseInt(event.target.value, 10))
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const deleteCampaign = (id) => {
        if (id) {
            callAPI({
                method: 'GET',
                url: `common/trash?id=${id}&type=campaign`,
            }, (resp) => {
                if (resp.status == 1) {
                    setShowPopup(false);
                    fetchCampaign();
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
            deleteCampaign(DeleteId);
        }
        setShowPopup(false);
    }

    const deletePopupCloseHandler = () => { setDeleteId(''); setShowPopup(false); }
    return (
        <div>
            <PageTitle title="Campaigns" />
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
                        {
                            (userCampaignCount < user.noOfCampaigns && user.planStatus) ?
                                <Link href='/user/createcampaigns'> <button className='ap_btn shine' >Create Campaign</button></Link>
                                :
                                <Tooltip title={(user.noOfCampaigns == 0 || !user.planStatus) ? 'You have not subscribe to any plan.' : `You already have ${user.noOfCampaigns} campaign as per your plan.`} placement="top" arrow><button className='ap_btn shine disable_btn' disabled={true}>Create Campaign</button> </Tooltip>
                        }

                    </div>

                </div>

                <div className='datatable_wrap'>

                    <Suspense >
                        <TableContainer component={Paper} className='table_container'>
                            <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                                {(campaignList.length == 0 && !loading) ? null : <TableHead className='table_head'>
                                    <TableRow>
                                        <TableCell align="left" className='table_head'>S.No</TableCell>
                                        <TableCell align="left" className='table_head'> Campaigns Name</TableCell>
                                        <TableCell align="left" className='table_head'>Type</TableCell>
                                        <TableCell align="center" className='table_head'>Registrations</TableCell>
                                        <TableCell align="center" className='table_head'>Earnings</TableCell>
                                        <TableCell align="left" className='table_head'>Actions</TableCell>
                                    </TableRow>
                                </TableHead>}

                                <>
                                    <TableBody className='table_body'>
                                        {loading ? <TableRow><TableCell align="center" className='table_data' colSpan={6}><DatatableLoader /></TableCell></TableRow>
                                            :
                                            campaignList.map((row, i) => (
                                                <TableRow className='table_row' key={i}>
                                                    <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                                        {(rowsPerPage * page) + (i + 1)}
                                                    </TableCell>
                                                    <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                                        <span> {row.title}</span>

                                                    </TableCell>
                                                    <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                                        {row.type}

                                                    </TableCell>
                                                    <TableCell style={{ width: 160 }} align="center" className='table_data'>
                                                        {row.noOfBookings ? row.noOfBookings : 0}
                                                    </TableCell>
                                                    <TableCell style={{ width: 160 }} align="center" className='table_data'>
                                                        {widgetCurrency[row?.currency]}   {row.totalEarnings ? row.totalEarnings : 0}
                                                    </TableCell>
                                                    <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                                        {(user.noOfCampaigns != 0) &&
                                                            <div className='table_action_wrap'>
                                                                <Tooltip title="Edit" placement="top" arrow>
                                                                    <Link href={`/user/createcampaigns?cid=${row._id}`}> <div className="action_edit" >{svg.edit}</div></Link>
                                                                </Tooltip>
                                                                <Tooltip title="Delete" placement="top" arrow>
                                                                    <div className="action_delete" onClick={() => handleDelete(row._id)}>{svg.delete}</div>
                                                                </Tooltip>
                                                                <Tooltip title="Widget Code" placement="top" arrow>
                                                                    <div className="action_edit" onClick={() => handleCopyPopUp(row._id, row.type)}>{svg.codeIcon}</div>
                                                                </Tooltip>

                                                                <Tooltip title={row?.isCompleted ? "Preview Widget" : ""} placement="top" arrow>
                                                                    <button className={`action_edit  ${row?.isCompleted ? '' : 'disable_btn'}`} disabled={row?.isCompleted ? false : true} onClick={() => { showPreview(row._id, row.type) }}>{svg.preview}</button>
                                                                </Tooltip>
                                                            </div>
                                                        }
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                    <TableFooter>
                                        {!loading ? (campaignList.length == 0) ? null : <TableRow >
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
                                        </TableRow> : null}
                                    </TableFooter>
                                </>

                            </Table>
                        </TableContainer>

                    </Suspense>
                    {!loading && (campaignList.length == 0) ? (
                        <div className='empty_box'><span>{svg.empty_record}</span>
                            <p className='empty_p'>{searchTerm ? 'You do not have campaign with this name' : ' You have not created any campaign yet.'}</p>
                            {searchTerm ? '' : <div> Please create campaign first.</div>}
                        </div>
                    ) : ''}
                </div>

            </div>

            <Popup
                heading={"Move To Trash"}
                show={showPopUp}
                type="delete"
                maxWidth={'440px'}
                onClose={deletePopupCloseHandler}
            >
                <ConfirmDeletePopup handlePopUp={handlePopUp} title="parmanently" />
            </Popup>


            <Popup
                heading={"Campaign Widget Code"}
                show={widgetPopup}
                onClose={PopupCloseHandler}
                maxWidth={'718px'}
            >
                <div className='input_wrapper' style={{ marginBottom: '0px' }}>
                    <textarea type="text" className="input widget_text" rows="3" name="subheading" readOnly={true} style={{ height: ' 105px', width: '100%' }} value={`<script src=${`${process.env.APP_URL}/widget-form.js`}></script>
                    <div class="bookinghub" data-campaign="${campData.campid}" data-camp-type="${campData.campType}"></div> `} />


                </div>
                <Alert severity="info" className='mb' sx={{ border: '1px solid #bee5eb', padding: '2px 16px' }}>Add the widget script once in the head and multiple divs to incorporate multiple widgets.</Alert>

                <div className='text-center content_center mt'>
                    <button type='button' className="cancel_btn" onClick={() => PopupCloseHandler()}>Close</button>
                    <button type='button' className="ap_btn delete_btn" onClick={() => copyToClipboard()}>{copied ? 'Copied!' : 'Copy'}</button>
                </div>

            </Popup>

        </div >
    )
}

export default page


