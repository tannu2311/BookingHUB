"use client"

import svg from '@/utils/svg';
import { Box, Tooltip } from '@mui/material'
import { useState, useEffect, Suspense } from 'react';
import { Table, TableHead, Paper, TableRow, TableCell, TableBody, TablePagination, TableFooter, TableContainer } from '@mui/material';
import { callAPI } from '@/utils/API'
import Popup from '@/app/components/popup/popup';
import ConfirmDeletePopup from '@/app/components/popup/deleteConfirm';
import { TablePaginationActions } from '@/app/components/common/TablePagination';
import DatatableLoader from '@/app/components/loader/DatatableLoader';



function RegistrationTrash() {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [RegistrationList, setRegistrationList] = useState([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('');
    const[deleteStore,setDeleteStore] = useState({showPopUp:false, deleteID:''})
    const [emptyPopUp, setEmptyPopUp] = useState(false);

    let clearSearch = (e) => {
        setSearchTerm('');
        fetchRegistration('')
    }

    const handleSearchKeyupEvent = async (e) => {
        let t = e.target;
        let searchTerm = t.value;
        setSearchTerm(searchTerm);

        if (e.keyCode === 13) {
            fetchRegistration(searchTerm)
        }
    }

    useEffect(() => {
        fetchRegistration()

    }, [page, rowsPerPage])


    const fetchRegistration = (search = searchTerm, pageNo = page, row = rowsPerPage) => {
        setLoading(true)

        callAPI({
            method: 'POST',
            url: '/user/registration',
            data: {
                user: search,
                page: pageNo + 1,
                listPerPage: row,
                showTrash: true
            },
        }, (resp) => {
            if (resp.status == 1) {

                setRegistrationList(resp.registrationsDetail)
                setCount(resp.totalRecords)
                setLoading(false)
            }
        })
    }

    const handleChangePage = (event, newPage) => {
        fetchRegistration(searchTerm, newPage, rowsPerPage)
        setPage(newPage);

    };

    const handleChangeRowsPerPage = (event) => {
        fetchRegistration(searchTerm, page, parseInt(event.target.value, 10))
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    //registration restore option 
    const handleRestore = (id) => {
        if (id) {
            callAPI({
                method: 'PUT',
                url: `common/trash`,
                data: {
                    id: id,
                    type: 'registration'
                }
            }, (resp) => {
                if (resp.status == 1) {
                    fetchRegistration();
                }
            })
        }
    }

  
    const handleDeletePopUp = (val) => {
        if(val){
            callAPI({
                method: 'DELETE',
                url: `/user/registration?id=${deleteStore.deleteID}`,
            }, (resp) => {
                if (resp.status == 1) {
                    setDeleteStore({showPopUp:false,deleteID:''});
                    fetchRegistration();
                }
            })
        }
        setDeleteStore({showPopUp:false,deleteID:''});
    }


     // empty trash 
     const emptyTrash = () => {

        callAPI({
            method: 'DELETE',
            url: `common/trash?type=registration`,
        }, (resp) => {
            if (resp.status == 1) {
                setEmptyPopUp(false);
                fetchRegistration();
            }
        })
    }

    const handletrash = () => {
        setEmptyPopUp(true);
    }

    const handleTrashPopUp = (val) => {
        if(val){
        emptyTrash();
    }
        setEmptyPopUp(false);
    }

    const trashPopupCloseHandler = () => { setEmptyPopUp(false); }

  
    return (
        <div>
            {((RegistrationList.length != 0) || searchTerm) && <div className='box_wrap'>
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
                            {(RegistrationList?.length != 0) && <TableHead className='table_head'>
                                <TableRow>
                                    <TableCell align="left" className='table_head'>S.No</TableCell>
                                    <TableCell align="left" className='table_head'>Name</TableCell>
                                    <TableCell align="left" className='table_head'>Email</TableCell>
                                    <TableCell align="left" className='table_head'>Campaign Type</TableCell>
                                    <TableCell align="left" className='table_head'>Campaign</TableCell>
                                    <TableCell align="left" className='table_head'>Actions</TableCell>
                                </TableRow>
                            </TableHead>}

                            <>
                                <TableBody className='table_body'>
                                    {loading ? <TableRow><TableCell align="center" className='table_data' colSpan={6}><DatatableLoader /></TableCell></TableRow>
                                        :
                                        RegistrationList.map((row, i) => (
                                            <TableRow className='table_row' key={i}>
                                                <TableCell style={{ width: 40 }} align="left" className='table_data'>{console.log(row, "row")}
                                                    {(rowsPerPage * page) + (i + 1)}
                                                </TableCell>
                                                <TableCell style={{ width: 100 }} align="left" className='table_data'>
                                                    {row.Details?.userInfo?.Name}
                                                </TableCell>
                                                <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                                    {row.Details?.userInfo?.Email}
                                                </TableCell>
                                                <TableCell style={{ width: 190 }} align="left" className='table_data'>
                                                    {row?.campaignType}
                                                </TableCell>
                                                <TableCell style={{ width: 212 }} align="left" className='table_data'>
                                                    {row.campaignId?.title}
                                                </TableCell>



                                                <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                                    <div className='table_action_wrap'>
                                                        <Tooltip title="Restore" placement="top" arrow>
                                                            <div className="action_edit" onClick={() => handleRestore(row._id)}>{svg.restore}</div>
                                                        </Tooltip>

                                                        <Tooltip title={"Delete"} placement="top" arrow>
                                                            <button className={`action_delete `}
                                                             onClick={()=>setDeleteStore({showPopUp:true,deleteID:row._id})}
                                                            >{svg.delete}</button>
                                                        </Tooltip>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}


                                </TableBody>
                                <TableFooter>
                                    {!loading ? (RegistrationList.length == 0) ? null : <TableRow >
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


                {!loading && (RegistrationList.length == 0) ? (
                    <div className='empty_box'><span>{svg.empty_record}</span>
                        <p className='empty_p'>{searchTerm? "No matching record found." : "Trash is empty."}</p> </div>
                ) : ''}
            </div>
            <Popup
                heading={"Delete Permanently"}
                show={deleteStore.showPopUp}
                type="delete"
                maxWidth={'440px'}
                onClose={()=>setDeleteStore({showPopUp:false,deleteID:''})}
            >
                <ConfirmDeletePopup handlePopUp={handleDeletePopUp} title="" />
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

        </div>
    )
}

export default RegistrationTrash