"use client"
import styles from '@/style/campaign.module.css'
import { Form } from '@/utils/formValidator';
import { Accordion, AccordionDetails, Typography, AccordionSummary, Button, Select, MenuItem, Alert} from '@mui/material';
import { useState } from 'react';
import { Calendar } from 'rsuite';
import { useForm } from "react-hook-form";
import svg from '@/utils/svg';
import {  InputFieldsForm, TicketTypes } from './CollectionForm';
import Popup from '@/app/components/popup/popup';
import { currencyOptions,paypaySupportedCurrency } from '@/utils/data';
import Step3 from './Step3'; import { useEffect } from 'react';
import { callAPI } from '@/utils/API';
import { common } from '@/utils/helper';
import Link from 'next/link';
import {  useSearchParams} from "next/navigation";

function Event({ activeTab, handleActiveTab, campaignid, campaignStepDeatils ,handleCampaignIdOnBack}) {
 
    const [addPaymentPopUp, setAddPaymentPopUp] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('')

    const [expanded, setExpanded] = useState('panel1');
    const [showInputPopUp, setShowInputPopUp] = useState(false)
    const [paypalAccList, setPaypalAccList] = useState([]);
    const [stripAccList, setStripAccList] = useState([]);

    const [selectedEventDates, setSlectedEventDates] = useState([])
    const [InputFieldList, setInputFieldList] = useState([{ inputType: 'text', label: 'Name' }, { inputType: 'email', label: 'Email' }, { inputType: 'tel', label: 'Phone' }, { inputType: 'textarea', label: 'Description' }]);
    const [ticketTypeList, setTicketTypeList] = useState([]);
    const [emptyError, setEmptyError] = useState(false);
    const [showPaymentAcc,setShowPaymentAcc] = useState(false);
    const [hasCentralSmtpAcc,setHasCentralSmtpAcc] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset, control, watch, getValues, setError, trigger, setValue } = useForm({
        defaultValues: {
            ticket_fee: 'paid',
            event_type:'single'
            ,smtp_type:'',
        }
    });
    const { register: register1, handleSubmit: handleSubmit2, formState: { errors: errors1 }, reset: reset1 } = useForm();
    const searchParams = useSearchParams();
 
    // Event DAte code Start 
    let eventDate = watch("event_date")

    function getDates(startDate, endDate) {
        const dateArray = [];
        let currentDate = new Date(startDate);
        if(watch('event_type') == 'single'){
            const formattedDate = currentDate.toISOString().split("T")[0];
            dateArray.push(formattedDate);
        }else{
            while (currentDate <= endDate) {
                const formattedDate = currentDate.toISOString().split("T")[0];
                dateArray.push(formattedDate);
                currentDate.setDate(currentDate.getDate() + 1);
            } 
        }
       
        return dateArray;
    }

    
    const centralSMTPDetail =() =>{
        callAPI({
            method: 'PATCH',
            url: 'common'
          }, (data) => { 
                 if(data.data.smtpDetails){ 
                    setHasCentralSmtpAcc(true);
                 }
          })
    }

    useEffect(() => { 
        if (eventDate) {
        if(watch('event_type') == 'single'){
            let singleDateEvent = getDates(eventDate, eventDate);
            setSlectedEventDates(singleDateEvent);
        }else{
            const dateRange = getDates(eventDate[0], eventDate[1]);
            setSlectedEventDates(dateRange);
        }         
        } 
        else {
        setSlectedEventDates([]);
    }
    }, [eventDate])
    // Event Date code end

    // User Payment Account Code Start
    useEffect(() => {
        paymentList('paypal');
        paymentList('stripe');
         centralSMTPDetail()
        //in case of edit event 
        if (campaignStepDeatils) {
            let paypal, stripe, cash = false;
            let paypal_account, stripe_account;
            (campaignStepDeatils.paymentMethod) && (campaignStepDeatils.paymentMethod).map((method) => {
                if (method == 'paypal') {
                    paypal = true,
                        paypal_account = campaignStepDeatils?.paymentAccountId?.paypal
                }
                else if (method == 'stripe') {
                    stripe = true,
                        stripe_account = campaignStepDeatils?.paymentAccountId?.stripe
                }
                else if (method == 'cash') {
                    cash = true
                }
            })

            let defaultValues = {
               
                registration_start:campaignStepDeatils?.registrationDate?.startDate && new Date(campaignStepDeatils?.registrationDate?.startDate) ,
                registration_ends:campaignStepDeatils?.registrationDate?.endDate && new Date(campaignStepDeatils?.registrationDate?.endDate) ,
                currency: campaignStepDeatils?.currency,
                fee: campaignStepDeatils?.fee,
                paypal: paypal,
                stripe: stripe,
                cash: cash,
                paypal_account: paypal_account,
                stripe_account: stripe_account,
                event_type:campaignStepDeatils?.event_type,
                smtp_type: campaignStepDeatils?.smtp_type
            }
            if(campaignStepDeatils.event_type == 'single'){
                defaultValues['event_date'] = new Date(campaignStepDeatils?.eventStartDate);
            }else if(campaignStepDeatils.event_type == 'multiple'){
                defaultValues['event_date'] = [new Date(campaignStepDeatils?.eventStartDate), new Date(campaignStepDeatils?.eventEndDate)];
            }
           
           if(campaignStepDeatils.ticket){
            setTicketTypeList(campaignStepDeatils?.ticket);
            let hasPaidTicket = campaignStepDeatils?.ticket.some(obj => obj.ticket_type === 'paid');
            hasPaidTicket ? setShowPaymentAcc(true) : setShowPaymentAcc(false);
           }  
            campaignStepDeatils.eventDays && campaignStepDeatils.eventDays.forEach((field) => {

                defaultValues[field.date + '_start'] = new Date(field.startTime);
                defaultValues[field.date + '_finish'] = new Date(field.endTime);
            });
            if(campaignStepDeatils?.smtp_type == "campaign"){
                defaultValues["server"] = campaignStepDeatils.smtpDetails?.server;
                defaultValues["from"] = campaignStepDeatils.smtpDetails?.from;
                defaultValues["port"] = campaignStepDeatils.smtpDetails?.port;
                defaultValues["password"] = campaignStepDeatils.smtpDetails?.password;
            }

            campaignStepDeatils.formFields && campaignStepDeatils.formFields.forEach((field) => {
                defaultValues[field.label] = true;
            });

            reset(defaultValues);
        if(campaignStepDeatils.formFields){
            const combinedArray = [...InputFieldList, ...campaignStepDeatils.formFields];
            const mergedArray = combinedArray.reduce((accumulator, currentValue) => {
                const existingObject = accumulator.find((obj) => obj.label === currentValue.label);
                if (!existingObject) {
                    accumulator.push(currentValue);
                }
                return accumulator;
            }, []);

            setInputFieldList(mergedArray)}
        }
    }, [])
  
    const paymentList = (keyword) => {
        callAPI({
            method: 'GET',
            url: `/common/paymentIntegrate?search=${keyword}`,
        }, (resp) => {
            if (keyword == 'paypal') {
                let paypalAcc = (resp.accountList).map((data) => {
                    return {
                        label: data.accountId,
                        value: data._id,

                    }
                })
                setPaypalAccList(paypalAcc);
            } else if (keyword == 'stripe') {
                let stripeAcc = (resp.accountList).map((data) => {
                    return {
                        label: data.accountId,
                        value: data._id,
                    }
                })
                setStripAccList(stripeAcc);
            }
        })
    }

    // User Payment Account Code End

    // input field code start 
    const PopupCloseHandler = (val) => {
        setShowInputPopUp(val);
        setAddPaymentPopUp(false)
    }

    const handleAddInputField = (val) => {
        const labelExists = InputFieldList.some((field) => field.label === val.label);

        if (!labelExists) {
            setInputFieldList((prevList) => [...prevList, val]);
            setValue(val.label.split(" ").join(""), true)
        }
        setShowInputPopUp(false)

    }
    // input field code End 
    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };
    const handleTab = (val) => {
        handleActiveTab(val);
        handleCampaignIdOnBack(campaignid)
    }

    const addEventDetail = (updatedval) => {

        const eventDateTime = [];

        //add event date and time 
        selectedEventDates.forEach((date) => {
            eventDateTime.push({
                date: date,
                startTime: updatedval[date + '_start'],
                endTime: updatedval[date + '_finish'],
            });
        });

        // add input fields 
        const iFields = [];
        for (const inputField of InputFieldList) {
            const label = inputField.label;
            if (updatedval.hasOwnProperty(label) && updatedval[label]) {
                (inputField.label == "Name" || inputField.label == "Email") ? null : iFields.push(inputField);
            }
        }

        //extract paymentMethod 
        const paymentOptions = ['paypal',, 'stripe', 'cash'];
        const payemtnmethodOption = [];
        let stripe_account, paypal_account;
        let IsValid = true;

        paymentOptions.forEach((fieldName) => {
            if (watch(fieldName)) {
                payemtnmethodOption.push(fieldName);
                if (fieldName == 'paypal') {
                    if(paypalAccList.length == 0){
                        setError(`${fieldName}`, { type: "custom", message: "Add paypal account." });
                        IsValid= false;
                  
                    }else{
                        paypal_account = updatedval.paypal_account;
                    }    
                }
                if (fieldName == 'stripe') {
                    if(stripAccList.length == 0){
                        IsValid= false;
                    setError(`${fieldName}`, { type: "custom", message: "Add stripe account." });
                    }else{
                        stripe_account = updatedval.stripe_account;
                    } 
                }
            }
        })

          let saveCampaign = {

            eventStartDate: updatedval.event_date[0],
            eventEndDate: updatedval.event_date[1],
            eventDays: eventDateTime,
            registrationDate: {
                startDate: updatedval.registration_start,
                endDate: updatedval.registration_ends,
            },
            ticket: ticketTypeList,
            formFields: iFields,
            registrationType: updatedval.ticket_fee,
            currency: updatedval.currency,
            fee: updatedval.fee,
            paymentMethod: payemtnmethodOption,
            paymentAccountId: {
                paypal: paypal_account,
                stripe: stripe_account
            },
        }
         //   For SMTP Email setting\
         saveCampaign['smtp_type'] = updatedval?.smtp_type;
         if(updatedval.smtp_type == 'central'){
            if(!hasCentralSmtpAcc){
             setError(`smtp_type`, { type: "custom", message: "Add central smtp email account." });
             IsValid = false;
         }          
         }else{
             saveCampaign['smtpDetails'] = {
                 'server' : updatedval.server  ,
                 'from':updatedval.from  ,'password' : updatedval.password,'port' : updatedval.port
             };
         }
        if(IsValid){
        common.saveCampaignData(campaignid,saveCampaign);
 
        handleActiveTab(3);
        }
    }


    const addTicketType = (val) => {
        setTicketTypeList(val);
        setEmptyError(false)
        let hasPaidTicket = val.some(obj => obj.ticket_type === 'paid'); 
        hasPaidTicket ? setShowPaymentAcc(true) : setShowPaymentAcc(false);
    }

    // On Clicking Continue APPLY VALIDATION FUNCTIONS 
    const eventDateContinue = async () => {
        const isValid = await trigger(['event_date', 'registration_start', 'registration_ends']);

        if (isValid) {
            for (const date of selectedEventDates) {
                const start = getValues(`${date}_start`);
                const end = getValues(`${date}_finish`);
               
                const isStartFinishValid = await trigger([`${date}_start`, `${date}_finish`]);
                if (start >= end && isStartFinishValid) {
                    setError(`${date}_start`, { type: "custom", message: "Start time should be less than finish time." });
                }
               
             }
             const event = getValues('event_date');
             let eventType = getValues('event_type');
             const registrationStart = getValues('registration_start');
             const registrationEnds = getValues('registration_ends');
             if (registrationStart >= registrationEnds) {
                setError('registration_start', { type: "custom", message: "Registration start should be less than registration ends." });
            }
            if(eventType == 'single'){
                if(registrationEnds >= event){
                    setError('registration_ends', { type: "custom", message: "Registration ends should be less than event date." });
                }
            }else{
                if(registrationEnds >= event[1]){
                    setError('registration_ends', { type: "custom", message: "Registration ends should be less than event end date." });
                }
            }
           
            const hasDateErrors = Object.keys(errors).some((key) => /\d{4}-\d{2}-\d{2}_(start|end)$/.test(key)); 
             
            if(!hasDateErrors && !Object.keys(errors).includes('registration_start') && !Object.keys(errors).includes('registration_ends')){
                setExpanded('panel2');
                const eventDateTime = [];
                let eventType = getValues('event_type')

                //add event date and time 
                selectedEventDates.forEach((date) => {
                    eventDateTime.push({
                        date: date,
                        startTime:  getValues(`${date}_start`),
                        endTime: getValues(`${date}_finish`),
                    });
                });
                let data;
                if(eventType == 'single'){
                    data  ={eventStartDate :event,eventEndDate:event,eventDays:eventDateTime,registrationDate:{startDate:registrationStart,endDate:registrationEnds} ,event_type:eventType}
                }else{
                     data ={eventStartDate :event[0],eventEndDate:event[1],eventDays:eventDateTime,registrationDate:{startDate:registrationStart,endDate:registrationEnds} ,event_type:eventType}
                }
                
               
               common.saveCampaignData(campaignid,data);

            }
        }
    }

    const TicketTypeContinue = () => {
        if (ticketTypeList.length == 0) {
            setEmptyError(true)
        } else {
            setExpanded('panel3');
            let data ={ ticket :ticketTypeList};
            common.saveCampaignData(campaignid,data);

        }
    }

    const formFieldContinue = () =>{
        if(showPaymentAcc){
            setExpanded('panel4');
        }else{
            setExpanded('panel5');
        }
          
           const iFields = [];
           for (const inputField of InputFieldList) {
               if (watch(`${inputField.label.split(" ").join("")}`)) {
                (inputField.label == "Name" || inputField.label == "Email") ? null : iFields.push(inputField);
               }
           }
           let data = {formFields:iFields};
           common.saveCampaignData(campaignid,data);

    }

    const paymentContinue =() =>{
        let IsValid = true;
          let saveCampaign = { }
                 const fieldNames = ['currency','paypal' ,'stripe' ,'cash','paypal_account' ,'stripe_account'];
                         
                    const registrationTypes = fieldNames.map(fieldName => trigger(fieldName));
                   
                    Promise.all(registrationTypes)
                            .then(results => { 
                                if (results.every(result => result)) {
                                   if(watch('paypal')){
                                      if(paypalAccList.length == 0){
                                        setError('paypal', { type: "custom", message: "Add paypal account." });
                                        IsValid = false;
                                      }
                                   }
                                   if(watch('stripe')){
                                    if(stripAccList.length == 0){
                                      setError('stripe', { type: "custom", message: "Add stripe account." });
                                      IsValid = false;
                                    }
                                 }
                                 if(IsValid){
                                    const paymentOptions = ['paypal', 'stripe', 'cash'];
                                    const payemtnmethodOption = [];
                                    paymentOptions.forEach((fieldName) => {
                                            if (watch(fieldName)) {
                                                payemtnmethodOption.push(fieldName);
                                        }
                                    })
                                           saveCampaign['currency'] = getValues('currency'),
                                            saveCampaign['paymentMethod'] = payemtnmethodOption;
                                            saveCampaign['paymentAccountId'] = {
                                                paypal: getValues('paypal_account'),
                                                stripe: getValues('stripe_account'), 
                                            }
                                  common.saveCampaignData(campaignid,saveCampaign);
                                  setExpanded('panel5');
                                  }
                             }
                            })
              }

    // if having no then Add account Function
    const onSubmitCreate = (newdata) => {
        newdata.paymentMethod = paymentMethod,
            callAPI({
                method: 'POST',
                url: `/common/paymentIntegrate`,
                data: newdata
            }, (resp) => {
                if (paymentMethod == 'paypal') paymentList('paypal');
                if (paymentMethod == 'stripe') paymentList('stripe');
                setAddPaymentPopUp(false)
                reset1()
            })
    }

    function CheckExpand(val){
        if(val == 'events'){
            return (errors.event_date || errors.registration_ends || errors.registration_start);
        }else if(val == 'ticket'){
            return (emptyError && ticketTypeList.length == 0);
        }else if(val == 'payment'){
            return (errors.currency || errors.fee || (errors.paypal && errors.stripe && errors.cash));
        }else if(val == 'smtp'){
            return (errors.smtp_type || errors.server || errors.port || errors.from || errors.password )
        }
        return false;
    }

    function customizeDateFormate(date){
        const formattedDate = new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        return formattedDate
    }
    return (

        <>
            <form onSubmit={handleSubmit(addEventDetail)} className={styles.step2_form_wrap}>
                <div className={(activeTab == 2) ? "show" : "hide"}>
                    <div>
                        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}  sx={{ boxShadow: 0}}>
                            <AccordionSummary
                               expandIcon={CheckExpand('events') ?'🔴' : svg.expand_arrow}
                                aria-controls="panel1bh-content"
                                id="panel1bh-header"
                            >
                                <Typography sx={{ width: '33%', flexShrink: 0 }} className={styles.accordian_heading}>
                                    Event Days
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div>
                                  <div className='input_wrapper_list'>
                                   <Form fieldname="event_type" label={`Event Type`} inputType={"select"} options={[{label:'Single Day' ,value:'single'},{label:'Multiple Day' ,value:'multiple'}]} control={control} errors={errors} isRequired={true} />
                                  { (watch('event_type') == 'single') ? <Form  dateFormate="dd-MM-yyyy" label="Event Date" disbaleDate={true} fieldname={`event_date`} inputType='datepicker' placeholder="Event Date" control={control} errors={errors} isRequired={true} />
                                    :
                                    <Form label="Event Dates" fieldname={`event_date`} inputType='daterangepicker' disbaleDate={true} placeholder="Event Dates" control={control} errors={errors} isDisable={false} isRequired={true} />
                                     }  
                                    </div>
                                    <div>
                                        {(selectedEventDates.length != 0) && <> <div className={styles.bussiness_hour_singe_wrapper}>
                                            <div className={styles.hour_wrap_label + " " + styles.event_hour}>
                                                <label>Date</label>
                                                <div>Start From<span className='bhub_required'>*</span></div>
                                                <div>Finish By<span className='bhub_required'>*</span></div>
                                            </div>
                                        </div>
                                            {
                                                selectedEventDates.map(date => <div className={styles.bussiness_hour_singe_wrapper} key={date}>
                                                    <div className={styles.single_hour_wrap}>
                                                        <div className={styles.days_data} style={{width:'135px'}}>{customizeDateFormate(date)}</div>
                                                    </div>
                                                    <div className={`${styles.date_list_wrap} cus_select`} style={{width:'100%'}}>
                                                        <Form dateFormate="HH:mm" fieldname={`${date}_start`} disbaleDate={true} inputType='datepicker' placeholder="Starts at " control={control} errors={errors} isDisable={false} isRequired={true} dateclass='w-100'/>
                                                        <Form dateFormate="HH:mm" fieldname={`${date}_finish`} disbaleDate={true} inputType='datepicker' placeholder="Ends at" control={control} errors={errors} isDisable={false} isRequired={true} dateclass='w-100'/>
                                                    </div>
                                                </div>
                                                )
                                            }
                                        </>
                                        }
                                    </div>
                                    <div className='input_wrapper_list mt'>
                                        <Form dateFormate="dd-MM-yyyy HH:mm" label="Registration Starts" fieldname={`registration_start`} disbaleDate={true} inputType='datepicker' placeholder="Registration Starts from " control={control} errors={errors} isDisable={false} isRequired={true} />
                                        <Form dateFormate="dd-MM-yyyy HH:mm" label="Registration Ends" fieldname={`registration_ends`} disbaleDate={true} inputType='datepicker' placeholder="Registration Ends at " control={control} errors={errors} isDisable={false} isRequired={true} />
                                    </div>

                                    <div className="text-right mt">
                                        <button type='button' className="ap_btn" onClick={() => eventDateContinue()}>Continue</button>
                                    </div>

                                </div>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}  sx={{ boxShadow: 0}}>
                            <AccordionSummary
                           expandIcon={CheckExpand('ticket') ?'🔴' : svg.expand_arrow}
                                aria-controls="panel2bh-content"
                                id="panel2bh-header"
                            >
                                <Typography sx={{ width: '33%', flexShrink: 0 }} className={styles.accordian_heading}>Add Ticket Types:
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div>
                                    {emptyError && <span className='error mb'>Please add atleast one Ticket type.</span>}

                                    <TicketTypes addTicketType={addTicketType} ticketList={ticketTypeList} />
                                    <div className="text-right mt">
                                        <button type='button' className="ap_btn" onClick={() => TicketTypeContinue()}>Continue</button>
                                    </div>
                                </div>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}  sx={{ boxShadow: 0}}>
                            <AccordionSummary
                            expandIcon={svg.expand_arrow}
                                aria-controls="panel2bh-content"
                                id="panel2bh-header"
                            >
                                <Typography sx={{ width: '33%', flexShrink: 0 }} className={styles.accordian_heading}>Form Fields</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div>
                                    <div className={styles.check_box_lists}>
                                        {InputFieldList.map((val, i) => <Form key={i} fieldname={`${val.label.split(" ").join("")}`} label={`${val.label}`} inputType={'checkbox'} control={control} isRequired={false} isDisable={((val.label == 'Email') || (val.label == 'Name')) ? true : false} />)}
                                        <div className={styles.inpt_add_btn} onClick={() => setShowInputPopUp(true)}><div>+</div> Add Input Fields</div>
                                    </div>

                                    <div className={styles.input_list_fields}>
                                        {
                                           InputFieldList.map((val, i) => watch(`${val.label.split(" ").join("")}`) && <div key={i} className={styles.items}>
                                           {(`${val.inputType}` == "text") && (
                                               <Form fieldname="default" label={`${val.label}`} inputType='text' register={register} errors={errors} isRequired={false} />
                                           )}
                                           {(`${val.inputType}` == "email") && (
                                               <Form fieldname='default' label={`${val.label}`} inputType='email' register={register} errors={errors} isRequired={false} />
                                           )}
                                           {(`${val.inputType}` == 'tel') && (
                                               <Form fieldname={'default'} inputType={"phone"} label={`${val.label}`} register={register} errors={errors} control={control} isRequired={false} />

                                           )}
                                           {(`${val.inputType}` == 'checkbox') && (
                                               <Form fieldname={'default'} label={`${val.label}`} inputType={'checkbox'} control={control} isRequired={false} />
                                           )}
                                           {(`${val.inputType}` == 'number') && (
                                               <Form fieldname='default' label={`${val.label}`} inputType='number' register={register} errors={errors} isRequired={false} applyValidation={false} />
                                           )}
                                           {(`${val.inputType}` == 'textarea') && (
                                               <Form fieldname='default' label={`${val.label}`} inputType='textarea' register={register} errors={errors} isRequired={false} />
                                           )}

                                           {(`${val.inputType}` == 'password') && (
                                               <Form inputType={'default'} fieldname={'password'} label={`${val.label}`} register={register} errors={errors} isRequired={false} />
                                           )}
                                           {(`${val.inputType}` == 'select') && (
                                               <Form fieldname="default" label={`${val.label}`} inputType={"select"} options={val.options.map(val => { return { label: val, value: val } })} control={control} errors={errors} isRequired={false} />

                                           )}
                                           {(`${val.inputType}` == 'radio') && (
                                               <Form fieldname={'default'} label={`${val.label}`} inputType={"radio"} options={val.options.map(val => { return { label: val, value: val } })} control={control} errors={errors} isRequired={false} />

                                           )}
                                            {(`${val.inputType}` == 'groupCheckBox') && (
                                                    <Form fieldname={'default'} label={`${val.label}`} inputType={"groupCheckBox"} options={val.options.map(val => { return { label: val, value: val } })} control={control} errors={errors} isRequired={false} />
                                                )}
                                           {(`${val.inputType}` == 'date') && (
                                               <Form fieldname={'appointment_date_picker'} disbaleDate={false} inputType='datepicker' dateFormate="yyyy-MM-dd" placeholder={`${val.label}`} label={`${val.label}`} control={control} errors={errors} isRequired={false} />
                                           )}

                                       </div>)
                                        }

                                    </div>
                                    <div className="text-right mt">
                                        <button type='button' className="ap_btn" onClick={() => formFieldContinue()}>Continue</button>
                                    </div>
                                </div>

                            </AccordionDetails>
                        </Accordion>
                    {(showPaymentAcc)  &&  <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}  sx={{ boxShadow: 0}}>
                            <AccordionSummary
                            expandIcon={CheckExpand('payment') ?'🔴' : svg.expand_arrow}
                                aria-controls="panel2bh-content"
                                id="panel2bh-header"
                            >
                                <Typography sx={{ width: '33%', flexShrink: 0 }} className={styles.accordian_heading}>Payment</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div className={styles.payment_wrap}>
                                
                                    <div className={styles.payment_method_wrap}>
                                        <Button className={styles.payment_paypal}  onClick={()=>{getValues('paypal') ? setValue('paypal',false) :  setValue('paypal',true)}} ><span className={styles.pay_check_box1}>
                                            <Form fieldname={'paypal'} inputType={'checkbox'} control={control} isRequired={true} fields={['paypal', 'stripe', 'cash']} watch={watch} />
                                        </span>{svg.paymentt}</Button>
                                        <Button className={styles.payment_stripe}  onClick={()=>{getValues('stripe') ? setValue('stripe',false) :  setValue('stripe',true)}} ><span className={styles.pay_check_box2}>
                                            <Form fieldname={'stripe'} inputType={'checkbox'} control={control} isRequired={true} fields={['paypal', 'stripe', 'cash']} watch={watch} />
                                        </span>{svg.stripe}</Button>
                                        <Button className={styles.payment_counter}  onClick={()=>{getValues('cash') ? setValue('cash',false) :  setValue('cash',true)}}><span className={styles.pay_check_box3}>
                                            <Form fieldname={'cash'} inputType={'checkbox'} control={control} isRequired={true} fields={['paypal', 'stripe', 'cash']} watch={watch} />
                                        </span>Cash On Counter</Button>
                                    </div>

                                    {(errors.paypal || errors.stripe || errors.cash) && <span className='error'>{errors?.paypal?.message || errors?.stripe?.message || errors?.cash?.message}</span>}
                                    {watch('cash') && <Alert severity="info" className='mt mb'  sx={{border:'1px solid #bee5eb', padding:'2px 16px'}}>If you choose "Cash on Counter" as the payment method, please ensure to check "Phone" field in the form fields.</Alert>}
                                    {(watch('paypal') || watch('stripe') || watch('cash')) && <div className='mt'><Form fieldname="currency" label={"Currency"} inputType={"select"} dateclass="#fff" options={watch('paypal') ? paypaySupportedCurrency :currencyOptions} isDisable={searchParams.get('cid') && campaignStepDeatils?.currency ? true :false} control={control} errors={errors} applyValidation={true} isRequired={true} /></div>}
                                    
                                    <div className='input_wrapper_list mt'>
                                        {watch('paypal') && ((paypalAccList.length) ? <><Form fieldname="paypal_account" label={` Paypal Account`} inputType={"select"} options={paypalAccList} control={control} errors={errors} isRequired={true} /></> : <div className={styles.create_acc_mes}>Currently no account added. Please add a paypal account by clicking <a onClick={() => { setPaymentMethod('paypal'); setAddPaymentPopUp(true) }}>here</a> </div>)
                                        }
                                        {watch('stripe') && ((stripAccList.length) ? <><Form fieldname="stripe_account" label={` Stripe Account`} inputType={"select"} options={stripAccList} control={control} errors={errors} isRequired={true} /></> : <div className={styles.create_acc_mes}>Currently no account added. Please add a stripe account by clicking <a onClick={() => { setPaymentMethod('stripe'); setAddPaymentPopUp(true) }}>here</a> </div>)
                                        }
                                    </div>

                                    <div className="text-right mt">
                                        <button type='button' className="ap_btn" onClick={() => paymentContinue()}>Continue</button>
                                    </div>
                                </div>
                            </AccordionDetails>
                        </Accordion>}

                        <Accordion expanded={expanded === 'panel5'} onChange={handleChange('panel5')}  sx={{ boxShadow: 0}}>
                            <AccordionSummary
                                expandIcon={CheckExpand('smtp') ?'🔴' : svg.expand_arrow}
                                aria-controls="panel2bh-content"
                                id="panel2bh-header"
                            >
                                <Typography sx={{ width: '33%', flexShrink: 0 }}>Email SMTP</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                        <div>

                        <Form fieldname={'smtp_type'} label={'SMTP Options'} inputType={"radio"} options={[{ label: 'Use central mail settings', value: 'central' }, { label: 'Add SMTP for this campaign', value: 'campaign' }]} control={control} errors={errors} isRequired={true} />
                        {(watch('smtp_type') == "central") && ((!hasCentralSmtpAcc) &&  <div className={styles.create_acc_mes}>Currently SMTP details are not added. Please update  SMTP  details by clicking <Link href={`${process.env.APP_URL}/user/email_setting`}>here</Link> </div>)}

                        {(watch('smtp_type') == 'campaign') && <>
                        <div className='input_wrapper_list'>
                            <Form fieldname='server' label='Mail Server' inputType='text' register={register} errors={errors} applyValidation={false} isRequired={true} />
                            <Form fieldname='from' label='From' inputType='email' register={register} errors={errors} applyValidation={true} isRequired={true} />
                          </div>
                            <div className='input_wrapper_list'> 
                                <Form inputType={'password'} fieldname={'password'} label={'Password'} register={register} errors={errors} isRequired={true} applyValidation={true} />
                                <Form fieldname='port' label={`Port`} inputType='number' register={register} errors={errors} isRequired={true} applyValidation={false} />
                            </div>
                            </>
                        }
                            </div>
                            </AccordionDetails>
                        </Accordion> 

                        <div className="space_between mt">
                            <button type='button' className="ap_btn_white mx_151" onClick={() => handleTab(1)}>Back</button>
                            <button type="submit" className="ap_btn mx_151" >Next</button>

                        </div>

                    </div>
                </div>
            </form>


            <div className={(activeTab == 3) ? styles.steps_form_wrap + " show" : " hide"}>
                <Step3  campaignid={campaignid} handleActiveTab={handleActiveTab} campaignStepDeatils={campaignStepDeatils} campaignType={'event'} />
            </div>
            <Popup show={addPaymentPopUp} onClose={PopupCloseHandler} heading={`Integrate ${paymentMethod} account`}>
                <form onSubmit={handleSubmit2(onSubmitCreate)}>
                    {(paymentMethod == 'paypal') && <>
                        <Form fieldname='accountId' label='Account ID' inputType='email' register={register1} errors={errors1}  isRequired={true} />
                        <Form fieldname='publicKey' label='Client ID' inputType='text' register={register1} errors={errors1} applyValidation={false}  isRequired={true} />
                        <Form fieldname='secretKey' label='Client Secret' inputType='password' register={register1} errors={errors1} isRequired={true} />
                    </>}
                    {(paymentMethod == 'stripe') && <>
                        <Form fieldname='accountId' label='Account ID' inputType='text' register={register1} errors={errors1} applyValidation={false} isRequired={true}  />
                        <Form fieldname='publicKey' label='Public Key' inputType='text' register={register1} errors={errors1} applyValidation={false} isRequired={true} />
                        <Form fieldname='secretKey' label='Secret Key' inputType='password' register={register1} errors={errors1} isRequired={true} applyValidation={false} />
                    </>}

                    <div className="text-center">
                        <button type="submit" className="ap_btn ap_btn_full" >Add</button>
                    </div>
                </form>
            </Popup>


            <Popup
                heading={"Add Input Fields"}
                show={showInputPopUp}
                onClose={PopupCloseHandler}
                maxWidth={'570px'}
            >
                <InputFieldsForm handleAddInputField={handleAddInputField} />

            </Popup>
        </>

    )
}

export default Event
