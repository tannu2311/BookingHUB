"use client"
import PageTitle from '@/app/components/common/PageTitle'
import svg from '@/utils/svg';
import { Box, Tooltip } from '@mui/material'
import { useState, useEffect, Suspense } from 'react';
import { Table, TableHead, Paper, TableRow, TableCell, TableBody, TablePagination, TableFooter, TableContainer } from '@mui/material';
import { callAPI } from '@/utils/API'
import Popup from '@/app/components/popup/popup';
import ConfirmDeletePopup, { ConfirmRestorePopup } from '@/app/components/popup/deleteConfirm';
import { TablePaginationActions } from '@/app/components/common/TablePagination';
import DatatableLoader from '@/app/components/loader/DatatableLoader';
import { widgetCurrency } from '@/utils/data';
import styles from '@/style/integration.module.css';
import RegistrationTrash from './RegistrationTrash';

function page() {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [campaignList, setCampaignList] = useState([]);
    const [DeleteId, setDeleteId] = useState();
    const [showPopUp, setShowPopup] = useState(false);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('');
    const [restoreId, setRestoreId] = useState({});
    const [restorePopUp, setRestorePopUp] = useState(false);
    const [emptyPopUp, setEmptyPopUp] = useState(false);
    const [activeTab, setActiveTab] = useState('campaign');


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
            method: 'POST',
            url: '/common/trash',
            data: {
                search: search,
                page: pageNo + 1,
                listPerPage: row,
                type: 'campaign'
            },
        }, (resp) => {
            if (resp.status == 1) {

                setCampaignList(resp.campaignslist)
                setCount(resp.totalRecords)
                setLoading(false)
            }
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

    //campaign empty trash 
    const emptyTrash = () => {

        callAPI({
            method: 'DELETE',
            url: `common/trash?type=campaign`,
        }, (resp) => {
            if (resp.status == 1) {
                setEmptyPopUp(false);
                fetchCampaign();
            }
        })
    }

    const handletrash = () => {
        setEmptyPopUp(true);
    }

    const handleTrashPopUp = () => {
        setEmptyPopUp(false);
        emptyTrash();
    }

    const trashPopupCloseHandler = () => { setEmptyPopUp(false); }


    //campaign restore option 
    const restore = (id) => {
        if (id) {
            callAPI({
                method: 'PUT',
                url: `common/trash`,
                data: {
                    id: id,
                    type: 'campaign'
                }
            }, (resp) => {
                if (resp.status == 1) {
                    setRestorePopUp(false);
                    fetchCampaign();
                }
            })
        }
    }

    const handleRestore = (id) => {
        setRestorePopUp(true);
        setRestoreId(id);
    }

    const handleRestorePopUp = (val) => {
        if (val) {
            restore(restoreId);
        }
        setRestorePopUp(false);
    }

    const restorePopupCloseHandler = () => { setRestoreId(''); setRestorePopUp(false); }

    // campaign delete option
    const deleteCampaign = (id) => {
        if (id) {
            callAPI({
                method: 'DELETE',
                url: `user/campaign?id=${id}`,
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
            <PageTitle title="Trash" />

            <div className='content_wrapper'>


                <div>
                    <div className="center_content">
                        <div className={styles.integration_container}>
                            <div
                                className={`${styles.integration_tab} ${activeTab === "campaign" ? styles.active_tab : ""
                                    }`}
                                onClick={() => setActiveTab("campaign")}
                            >
                                Campaign Trash
                            </div>
                            <div
                                className={`${styles.integration_tab} ${activeTab === "registration" ? styles.active_tab : ""
                                    }`}
                                onClick={() => setActiveTab("registration")}
                            >
                                Registration Trash
                            </div>

                        </div>


                    </div>
                    <div className="tab-content">
                        {activeTab === "registration" && <RegistrationTrash />}
                    </div>
                </div>


                {activeTab == 'campaign' && <>
                    {((campaignList.length != 0) || searchTerm )&& <div className='box_wrap'>
                        <Box className="search_wrapper">
                            <span className="search_icon">{svg.search}</span>
                            <input type="text" placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyUp={handleSearchKeyupEvent} />
                            {searchTerm ?
                                <span className="search_clear" onClick={(e) => clearSearch(e)}>x</span>
                                : null
                            }
                        </Box>

                        <div>
                            <button className='ap_btn' onClick={() => handletrash()}>Empty Trash</button>
                        </div>

                    </div>}

                    <div className='datatable_wrap'>

                        <Suspense >
                            <TableContainer component={Paper} className='table_container'>
                                <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                                    {(campaignList?.length != 0) && <TableHead className='table_head'>
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
                                                            {widgetCurrency[row.currency]} {row.totalEarnings ? row.totalEarnings : 0}
                                                        </TableCell>
                                                        <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                                            <div className='table_action_wrap'>
                                                                <Tooltip title="Restore" placement="top" arrow>
                                                                    <div className="action_edit" onClick={() => handleRestore(row._id)}>{svg.restore}</div>
                                                                </Tooltip>
                                                                <Tooltip title="Delete" placement="top" arrow>
                                                                    <div className="action_delete" onClick={() => handleDelete(row._id)}>{svg.delete}</div>
                                                                </Tooltip>
                                                            </div>
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
                                <p className='empty_p'>{searchTerm? "No matching record found." : "Trash is empty."}</p> </div>
                        ) : ''}
                    </div>
                </>
                }
            </div>

            {/* delete popoup */}
            <Popup
                heading={"Delete permanently"}
                show={showPopUp}
                type="delete"
                maxWidth={'440px'}
                onClose={deletePopupCloseHandler}
            >
                <ConfirmDeletePopup handlePopUp={handlePopUp} title=" parmanently" />
            </Popup>

            {/* Restore popoup */}

            <Popup
                heading={"Restore"}
                show={restorePopUp}
                type="delete"
                maxWidth={'440px'}
                onClose={restorePopupCloseHandler}
            >
                <ConfirmRestorePopup handlePopUp={handleRestorePopUp} name={'this campaign'} />
            </Popup>

            {/* Empty popoup */}

            <Popup
                heading={"Empty Trash"}
                show={emptyPopUp}
                type="delete"
                maxWidth={'440px'}
                onClose={trashPopupCloseHandler}
            >
                <ConfirmDeletePopup handlePopUp={handleTrashPopUp} title=" parmanently" />
            </Popup>


        </div >
    )
}

export default page


