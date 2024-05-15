"use client"

import svg from '@/utils/svg';
import { Box, Tooltip } from '@mui/material'
import { useState, useEffect, Suspense, useRef } from 'react';
import { Table, TableHead, Paper, TableRow, TableCell, TableBody, TablePagination, TableFooter, TableContainer } from '@mui/material';
import { callAPI } from '@/utils/API'
import Popup from '@/app/components/popup/popup';
import { TablePaginationActions } from '@/app/components/common/TablePagination';
import DatatableLoader from '@/app/components/loader/DatatableLoader';
import styles from '@/style/setting.module.css'
import { useReactToPrint } from 'react-to-print';

function Billing() {
  const [previewPopUp, setPreviewPopUp] = useState({ show: false, detail: {} });
  const [billingList, setBillingList] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const invoiceRef = useRef()
  const fetchInvoices = (search = searchTerm, page = page, listPerPage = rowsPerPage) => {
    setIsLoading(true);
    callAPI({
      method: 'GET',
      url: `/user/checkout?page=${page + 1}&listPerPage=${listPerPage}&search=${search}`,
    }, (resp) => {
      setIsLoading(false);
      if (resp.status == 1) {
        setBillingList(resp.data);
      }
    })
  }

  useEffect(() => {
    fetchInvoices(searchTerm, page, rowsPerPage);
  }, []);

  const handleChangePage = (event, newPage) => {
    fetchInvoices(searchTerm, newPage, rowsPerPage)
    setPage(newPage);

  };

  const handleChangeRowsPerPage = (event) => {
    fetchInvoices(searchTerm, page, parseInt(event.target.value, 10))
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const customizeDateFormate = (date) => {
    const formattedDate = new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    return formattedDate
  }

  let clearSearch = (e) => {
    setSearchTerm('');
    fetchInvoices('', page, rowsPerPage);
  }

  const handleSearchKeyupEvent = async (e) => {
    let t = e.target;
    let searchTerm = t.value;
    setSearchTerm(searchTerm);

    if (e.keyCode === 13) {
      fetchInvoices(searchTerm, page, rowsPerPage);
    }
  }


  const handleDownloadInvoice = useReactToPrint({
    content: () => invoiceRef.current,
    documentTitle: 'invoice',
    pageStyle: `
  @media print {
    body {
      margin: 0;
      padding:25px;
    }
  }
`,
  });

  return (
    <div>
     
      <div className='profile_page'>


      {(billingList.length == 0 && !isLoading) ? null : <div className='box_wrap' style={{ marginTop: '0px' }}>
          <Box className="search_wrapper">
            <span className="search_icon">{svg.search}</span>
            <input type="text" placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyUp={handleSearchKeyupEvent} />
            {searchTerm ?
              <span className="search_clear" onClick={(e) => clearSearch(e)}>x</span>
              : null
            }
          </Box>
            <div></div>
        </div>}

        <div className='datatable_wrap'>

          <Suspense >
           

            <TableContainer component={Paper} className='table_container'>
              <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                {(billingList.length == 0 && !isLoading) ? null : <TableHead className='table_head'>
                  <TableRow>
                    <TableCell className='table_head'>S.No</TableCell>
                    <TableCell align="left" className='table_head'>Transaction ID</TableCell>
                    <TableCell align="left" className='table_head'>Plan</TableCell>
                    <TableCell align="left" className='table_head'>Date</TableCell>
                    <TableCell align="left" className='table_head'>Amount</TableCell>
                    <TableCell align="left" className='table_head'>Invoice</TableCell>

                  </TableRow>
                </TableHead>}

                <>
                  <TableBody className='table_body'>
                    {isLoading ? <TableRow><TableCell align="center" className='table_data' colSpan={6}><DatatableLoader /></TableCell></TableRow>
                      :
                      billingList.map((row, i) => (
                        <TableRow className='table_row' key={i}>
                          <TableCell style={{ width: 60 }} align="left" className='table_data'>
                            {(rowsPerPage * page) + (i + 1)}
                          </TableCell>
                          <TableCell style={{ width: 160 }} align="left" className='table_data'>

                            <div style={{ color: "#DD1047" }}>{row?.Details?.invoiceNumber}</div>

                          </TableCell>
                          <TableCell style={{ width: 160 }} align="left" className='table_data'>
                            {row?.Details?.planname}

                          </TableCell>
                          <TableCell style={{ width: 160 }} align="left" className='table_data'>
                            {customizeDateFormate(row?.Details?.paymentDate)}
                          </TableCell>

                          <TableCell style={{ width: 160 }} align="left" className='table_data'>
                            $ {row?.Details?.amount}
                          </TableCell>
                          <TableCell style={{ width: 160 }} align="center" className='table_data'>
                            <div className='table_action_wrap'>
                              <Tooltip title="Preview" placement="top" arrow>
                                <div className="action_edit" onClick={() => setPreviewPopUp({ show: true, detail: row.Details })}>{svg.preview}</div>
                              </Tooltip>
                              <Tooltip title="Download" placement="top" arrow>
                                <div className="action_delete" onClick={() => {
                                  setPreviewPopUp({ show: false, detail: row.Details });
                                  setTimeout(() => handleDownloadInvoice(), 2000)
                                }} >{svg.download}</div>
                              </Tooltip>

                            </div>
                          </TableCell>
                        </TableRow>

                      ))

                    }

                  </TableBody>
                  {(billingList.length == 0 || isLoading) ? null : <TableFooter>
                    <TableRow >
                      <TablePagination className='table_footer'
                        rowsPerPageOptions={[5, 10, 25]}
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
          {!isLoading && (billingList.length == 0) ? (
            <div className='empty_box'><span>{svg.empty_record}</span>
              <p className='empty_p'>No billing records found.</p>
            </div>
          ) : ''}
        </div>

      </div>


      <Popup
        show={previewPopUp?.show}
        onClose={() => setPreviewPopUp({ show: false, detail: {} })}
        maxWidth={'800px'}
      >

        <div id='content_to_export' className={styles.invoice_wrap} ref={invoiceRef}>
          <div className={styles.invoice_heads}>
            <p>Invoices</p>
            {(previewPopUp?.detail?.invoiceNumber) && <h3>{previewPopUp.detail.invoiceNumber}</h3>}
            <p>${previewPopUp.detail.amount} paid on {customizeDateFormate(previewPopUp.detail.paymentDate)}</p>
          </div>
          <p className={styles.summary}>Summary</p>
          <div className={styles.boxes_wrap}>
            <div>
              <p><span>Billed to : </span>{previewPopUp.detail.email}</p>
              <p><span>Payment Date :</span> {customizeDateFormate(previewPopUp.detail.paymentDate)}</p>
            </div>
            <div>
              {(previewPopUp?.detail?.invoiceNumber) && <p><span>Invoice no :</span> {previewPopUp.detail.invoiceNumber}</p>}
              <p><span> Currency :</span> $ (USD)</p>
              <p><span>Subscription From :</span> {customizeDateFormate(previewPopUp.detail.subscribedfromDate)} </p>
              <p><span>Subscription To :</span> {customizeDateFormate(previewPopUp.detail.subscribedToDate)} </p>

            </div>
          </div>


          <div className={styles.table_conatiner}>
            <table className={styles.table} id="detail_table">
              <thead>
                <tr>
                  <th>Plan</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr >
                  <td>{previewPopUp.detail.planname}</td>
                  <td>{previewPopUp.detail.amount}</td>
                </tr>

              </tbody>
            </table>
          </div>
          <div>
            <p>Subtotal : <span> $ {previewPopUp.detail.amount}</span></p>
            <p>Total : <span>$ {previewPopUp.detail.amount}</span></p>
          </div>

        </div>

      </Popup>

    </div >

  )
}

export default Billing

