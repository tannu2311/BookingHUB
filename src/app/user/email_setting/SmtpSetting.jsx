"use client"
import styles from '@/style/emailSetting.module.css';
import { Form } from '@/utils/formValidator';
import { CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { callAPI } from '@/utils/API';
import bcrypt from 'bcryptjs';

function SmtpSetting() {
  const [btnLoader, setBtnLoader] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset, control } = useForm({});

  useEffect(() => {
    callAPI({
      method: 'PATCH',
      url: `/common`,
    }, (resp) => {
      if (resp) {
        if(resp.data.smtpDetails)
        {
          let details = resp.data.smtpDetails;
          reset({
            'server' : details.server,
            'from' : details.from,
            'port' : details.port,
          })
        }
      }
    })
  },[]);

  const onSubmit = async(updatedvalues) => {
    setBtnLoader(true);
    callAPI({
      method: 'POST',
      url: `/common`,
      data: updatedvalues,
    }, (resp) => {
    setBtnLoader(false);

      if (resp) {
      }
    })
  }
  return (
    <div className={styles.smtp_wrapper}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Form fieldname='server' label='Mail Server' inputType='text' register={register} errors={errors} applyValidation={false} isRequired={true} />

        <Form fieldname='from' label='From' inputType='email' register={register} errors={errors} applyValidation={true} isRequired={true} />
        <div className='input_wrapper_list'>
          <Form inputType={'password'} fieldname={'password'} label={'Password'} register={register} errors={errors} isRequired={true} applyValidation={true} />
          <Form fieldname='port' label={`Port`} inputType='number' register={register} errors={errors} isRequired={true} applyValidation={false} />
        </div>

        <div className="text-right">
          <button type="submit" disabled={btnLoader} className="ap_btn mx_151">Save
            {btnLoader ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : ''}
          </button>
        </div>
      </form>
    </div>
  )
}

export default SmtpSetting