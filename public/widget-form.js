var HOST_URL = '';

//global variables
var _defaultEN = {
  days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  daysMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  today: 'Today',
  clear: 'Clear',
  dateFormat: 'yyyy-MM-dd',
  timeFormat: 'hh:mm aa',
  firstDay: 0
};
const widgetCurrency = { afn: '؋', all: 'L', dzd: 'دج', aoa: 'Kz', ars: '$', amd: '֏', awg: 'ƒ', aud: '$', azn: '₼', bsd: '$', bdt: '৳', bbd: 'Bds$', bzd: 'BZ$', bmd: '$', bob: 'Bs.', bam: 'KM', bwp: 'P', brl: 'R$', gbp: '£', bnd: '$', bgn: 'лв', bif: 'FBu', khr: '៛', cad: '$', cve: 'Esc', kyd: '$', xaf: 'FCFA', xpf: '₣', clp: '$', cny: '¥', cop: '$', kmf: 'CF', cdf: 'FC', crc: '₡', hrk: 'kn', czk: 'Kč', dkk: 'kr', djf: 'Fdj', dop: 'RD$', xcd: '$', egp: '£', etb: 'Br', eur: '€', fkp: '£', fjd: '$', gmd: 'D', gel: '₾', gip: '£', gtq: 'Q', gnf: 'FG', gyd: '$', htg: 'G', hnl: 'L', hkd: '$', huf: 'Ft', isk: 'kr', inr: '₹', idr: 'Rp', ils: '₪', jmd: 'J$', jpy: '¥', kzt: '₸', kes: 'KSh', kgs: 'som', lak: '₭', lbp: '£', lsl: 'L', lrd: '$', mop: 'MOP$', mkd: 'ден', mga: 'Ar', mwk: 'MK', myr: 'RM', mvr: 'ރ', mro: 'UM', mur: 'Rs', mxn: '$', mdl: 'L', mnt: '₮', mad: 'د.م.', mzn: 'MT', mmk: 'K', nad: '$', npr: 'रू', ang: 'ƒ', twd: 'NT$', nzd: '$', nio: 'C$', ngn: '₦', nok: 'kr', pkr: '₨', pab: 'B/.', pgk: 'K', pyg: '₲', pen: 'S/.', php: '₱', pln: 'zł', qar: 'ر.ق', ron: 'L', rub: '₽', rwf: 'RWF', std: 'Db', shp: '£', svc: '₡', wst: 'WST', sar: 'ر.س', rsd: 'дин.', scr: 'Rs', sll: 'SLL', sgd: '$', sbd: '$', sos: 'SOS', zar: 'R', krw: '₩', lkr: 'රු', srd: 'SRD', szl: 'E', sek: 'kr', chf: 'CHF', tjs: 'ЅМ', tzs: 'TSh', thb: '฿', top: 'T$', ttd: 'TT$', try: '₺', ugx: 'UGX', uah: '₴', aed: 'د.إ', usd: '$', uyu: '$U', uzs: 'soʻm', vuv: 'VT', vnd: '₫', xof: 'CFA', yer: '﷼', zmw: 'ZMW' };
const widgetloadDependencies = () => {
  // Load Air Datepicker
  const airDatepickerCss = document.createElement('link');
  airDatepickerCss.rel = 'stylesheet';
  airDatepickerCss.type = 'text/css';
  airDatepickerCss.href = `${HOST_URL}/air-datepicker.css`; // Replace with the actual path
  const airDatepickerScript = document.createElement('script');
  airDatepickerScript.type = 'text/javascript';
  airDatepickerScript.src = `${HOST_URL}/air-datepicker.js`; // Replace with the actual path
  // Load International telephone input
  const telInputCss = document.createElement('link');
  telInputCss.rel = 'stylesheet';
  telInputCss.href = `https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/css/intlTelInput.css`;
  const telInputScript = document.createElement('script');
  telInputScript.src = `https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/intlTelInput.min.js`; // Replace with the actual path

  const metaTag = document.createElement('meta');
  metaTag.name = 'viewport';
  metaTag.content = 'width=device-width, initial-scale=1';


  // Append the link and script elements to the document's head
  document.head.appendChild(airDatepickerCss);
  document.head.appendChild(airDatepickerScript);
  document.head.appendChild(telInputCss);
  document.head.appendChild(telInputScript);
  document.head.appendChild(metaTag);

  // document.body.classList.add('rtl')
  const bookingHubElements = document.querySelectorAll('.bookinghub');
  bookingHubElements.forEach((divElement, index) => processBookingHub(divElement, index));
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', widgetloadDependencies);
} else {
  // If the DOM is already loaded, execute immediately
  widgetloadDependencies();
}
async function processBookingHub(divElement, index) {
  const campaignID = divElement.getAttribute('data-campaign');
  const campaignType = divElement.getAttribute('data-camp-type');
  divElement.id = `${campaignID}-${index}`
  let parentelementid = `${campaignID}-${index}`;
  let response = await fetch(HOST_URL + `/api/externalWidgetApi?id=${campaignID}&type=${campaignType}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }
  else {
    let data = await response.json();
    let langcode;
    let enablertl = data?.campaignDetail?.enableRTL ? data?.campaignDetail?.enableRTL : false;
    if (data?.campaignDetail?.language) {
      langcode = data?.campaignDetail?.language;
    } else {
      langcode = "en"
    }
    let retval = await fetch(HOST_URL + `/api/user/language?id=${data?.campaignDetail?.campaignID?.userId}&code=${langcode}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    let langdata = await retval.json();
    window[parentelementid + "_lang"] = langdata.data;

    if (campaignType === 'appointment') {
      var styleSheet = document.createElement("style");
      styleSheet.type = "text/css"
      styleSheet.innerText = css('template1');
      document.head.appendChild(styleSheet);
      appointmentForm(data.campaignDetail, campaignID, campaignType, parentelementid, enablertl);
    }
    else if (campaignType === 'booking') {
      if (data.campaignDetail.reservationType == "room") {
        var styleSheet = document.createElement("style");
        styleSheet.type = "text/css"
        styleSheet.innerText = css('template4');
        document.head.appendChild(styleSheet);
      } else {
        var styleSheet = document.createElement("style");
        styleSheet.type = "text/css"

        styleSheet.innerText = css('template3');
        document.head.appendChild(styleSheet);
      }
      bookingSeatTableRoom(data.campaignDetail, campaignID, campaignType, parentelementid, enablertl);
    }
    else if (campaignType === 'event') {
      var styleSheet = document.createElement("style");
      styleSheet.type = "text/css"
      styleSheet.innerText = css('template2');
      document.head.appendChild(styleSheet);
      eventForm(data.campaignDetail, campaignID, campaignType, parentelementid, enablertl);
    }
  }
}
// Utility Function
async function saveData(parentelementid, bookingDetails) {
  if (window[parentelementid + "_visitorId"]) {
    const response = await fetch(HOST_URL + `/api/externalWidgetApi`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingDetails),
    });
    let res = await response.json();
    if (res.status == 0) {
      return res;
    }
    else {
      return res.status;
    }
  }
}
function createThankYouSection(parentelementid, finaldata, data, displaySelectedData, parentelement) {

  let langData = window[parentelementid + "_lang"];

  const thankuLoader = parentelement.querySelector('#thanku_loader');
  thankuLoader.style.display = 'none';
  const thankyou = parentelement.querySelector('#thankyoumsg');
  thankyou.style.display = 'block';
  thankyou.textContent = data.thankyouMessage;
  const orderdetails = parentelement.querySelector('#orderdetails')
  orderdetails.style.display = 'block';
  if (finaldata.campaignType == "appointment") {
    const AppointDate = parentelement.querySelector('#appoint_date');
    AppointDate.textContent = customizeDateFormate(finaldata.bookingDetails?.appointmentDate);
    const selected_date = parentelement.querySelector('#selected_date');
    selected_date.textContent = (new Date(`2000-01-10  ${finaldata.bookingDetails?.slotTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    if (finaldata.bookingDetails?.staff) {
      const staff_div = parentelement.querySelector('#staff_div');
      staff_div.style.display = 'flex';
      let staff = data.staff.find(staff => staff.id === finaldata.bookingDetails?.staff);
      const selected_staff = parentelement.querySelector('#selected_staff');
      selected_staff.textContent = staff.name;
    }
  }
  if (finaldata.campaignType == "booking") {
    if (finaldata.bookingDetails?.Checkindate) {
      const checkin = parentelement.querySelector('#check_in');
      checkin.textContent = customizeDateFormate(finaldata.bookingDetails.Checkindate);
      const checkout = parentelement.querySelector('#check_out');
      checkout.textContent = customizeDateFormate(finaldata.bookingDetails.Checkoutdate);
    }
    if (finaldata.bookingDetails?.bookingType == 'seat' || finaldata.bookingDetails?.bookingType == 'table') {
      const book_date = parentelement.querySelector('#book_date');
      book_date.textContent = customizeDateFormate(finaldata.bookingDetails.bookingDate);
    }
  }
  if (finaldata.bookingDetails?.paymentMode != 'cash') {
    const billTo = parentelement.querySelector('#bill_to');
    billTo.textContent = finaldata.bookingDetails.paymentInvoice.email;
  }
  const paymentMethod = parentelement.querySelector('#pay_method');
  if (finaldata.bookingDetails?.paymentMode == 'cash' && langData[24]) {
    paymentMethod.textContent = langData[24];
  }
  else if (finaldata.bookingDetails?.paymentMode == 'paypal' && langData[25]) {
    paymentMethod.textContent = langData[25];
  }
  else if (finaldata.bookingDetails?.paymentMode == 'stripe' && langData[26]) {
    paymentMethod.textContent = langData[26];
  }
  else {
    paymentMethod.textContent = finaldata.bookingDetails?.paymentMode;
  }

  if (finaldata.bookingDetails?.paymentMode != 'cash') {
    const transactionID = parentelement.querySelector('#transaction');
    transactionID.textContent = finaldata.bookingDetails?.paymentMode == 'paypal' ? finaldata.bookingDetails?.paymentInvoice?.transactionId : finaldata.bookingDetails?.paymentInvoice?.invoiceNumber;
  } else {
    const bill = parentelement.querySelector('#bill');
    bill.style.display = 'none';
    const trans = parentelement.querySelector('#trans');
    trans.style.display = 'none'
  }
  const totalAmount = parentelement.querySelector('#tot_amount');
  totalAmount.textContent = finaldata.bookingDetails?.paymentMode == 'cash' ? `${widgetCurrency[finaldata.bookingDetails?.currency]} ${finaldata.bookingDetails?.amount}` : `${widgetCurrency[finaldata.bookingDetails?.paymentInvoice.currency.toLowerCase()]} ${finaldata.bookingDetails?.paymentInvoice?.price}`;
  if (finaldata.campaignType == "event" || finaldata.campaignType == "booking") {
    const table = parentelement.querySelector('#detail_table');
    const tbody = document.createElement('tbody');
    let row;
    for (const key in displaySelectedData) {
      row = tbody.insertRow();
      const cell_1 = row.insertCell();
      cell_1.textContent = finaldata?.campaignType == "event" ? `${displaySelectedData[key].title}` : `${displaySelectedData[key].name}`;
      const cell_2 = row.insertCell();
      cell_2.textContent = `${finaldata.bookingDetails.selectedRecords[key]}`;
      const cell_3 = row.insertCell();
      cell_3.textContent = `${finaldata.bookingDetails?.paymentMode == 'cash' ? widgetCurrency[finaldata.bookingDetails?.currency] : widgetCurrency[finaldata.bookingDetails?.paymentInvoice.currency.toLowerCase()]} ${displaySelectedData[key].price}`;
      const cell_4 = row.insertCell();
      cell_4.textContent = `${finaldata.bookingDetails?.paymentMode == 'cash' ? widgetCurrency[finaldata.bookingDetails?.currency] : widgetCurrency[finaldata.bookingDetails?.paymentInvoice.currency.toLowerCase()]} ${finaldata.bookingDetails.selectedRecords[key] * displaySelectedData[key].price}`;
    }
    table.appendChild(tbody);
  }
}
function tableSkeletonLoader(parentelement) {
  // Skeleton Loader Start
  const thankuLoader = parentelement.querySelector('#thanku_loader');
  for (let i = 0; i < 2; i++) {
    const skeletonTextDiv = document.createElement('div');
    skeletonTextDiv.className = 'skeleton skeleton-text skeleton-text__body';
    thankuLoader.appendChild(skeletonTextDiv);
  }
  const skeletonTableDiv = document.createElement('div');
  skeletonTableDiv.className = 'skeleton skeleton-table';
  thankuLoader.appendChild(skeletonTableDiv);
  // Skeleton Loader End
}
function paypalBtnLoader(parentelement) {
  const paypalLoader = parentelement.querySelector('#paypal_loader');
  for (let i = 0; i < 2; i++) {
    const skeletonTextDiv = document.createElement('div');
    skeletonTextDiv.className = 'skeleton skeleton-text skeleton-text__body';
    skeletonTextDiv.style.height = '50px';
    paypalLoader.appendChild(skeletonTextDiv);
  }
}
async function handlePayment(parentelementid, paymentType, data, campaignID, bookingDetails, total, email, displaySelectedData) {
  let parentelement = document.getElementById(parentelementid);
  if (paymentType === 'stripe') {
    let widget_payment_checkout = parentelement.querySelector('#widget_payment_checkout');
    widget_payment_checkout.style.display = 'block';
    const paypalbutton = parentelement.querySelector('#paypal-button-container');
    paypalbutton.style.display = 'none';
    let stripe_checkout = parentelement.querySelector('#checkout');
    stripe_checkout.style.display = 'block';
    let stripescript = parentelement.querySelector('#stripescript');
    if (!stripescript) {
      const stripeScript = document.createElement('script');
      stripeScript.src = "https://js.stripe.com/v3/";
      stripeScript.id = 'stripescript';
      document.head.appendChild(stripeScript);
      let payid = data.paymentAccountId.stripe;
      const result = await fetch(HOST_URL + '/api/paymentControl', {
        method: 'POST',
        body: JSON.stringify({ total, payid, currency: data.currency, email })
      });
      const res = await result.json();
      const { clientSecret, publicKey } = res;
      if (res) {
        const stripe = Stripe(publicKey);
        const checkout = await stripe.initEmbeddedCheckout({
          clientSecret,
          onComplete: async () => {
            checkout.destroy();
            widget_payment_checkout.style.display = 'none';
            tableSkeletonLoader(parentelement);
            let payid = data.paymentAccountId.stripe;
            let sessionid = checkout.embeddedCheckout.checkoutSessionId;
            const result = await fetch(HOST_URL + `/api/paymentControl?payType=stripe&payid=${payid}&clientSecret=${sessionid}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            });
            let resdata = await result.json();
            if (result) {
              bookingDetails.paymentInvoice = resdata.payData;
              let finaldata = {
                campaignID,
                campaignType: data.campaignID.type,
                visitorId: window[parentelementid + "_visitorId"],
                bookingDetails
              }
              let res = await saveData(parentelementid, finaldata);
              if (res === 1) {
                createThankYouSection(parentelementid, finaldata, data, displaySelectedData, parentelement);
              }
            }
          }
        });
        checkout.mount(stripe_checkout);
      }
    }
  }
  else if (paymentType === 'paypal') {
    paypalBtnLoader(parentelement);
    let widget_payment_checkout = parentelement.querySelector('#widget_payment_checkout');
    widget_payment_checkout.style.display = 'block';
    let stripe_checkout = parentelement.querySelector('#checkout');
    stripe_checkout.style.display = 'none';
    const paypalbutton = parentelement.querySelector('#paypal-button-container');
    paypalbutton.style.display = 'block';
    let thanksdata = data.thankyouMessage;
    const pyapalbutton = parentelement.querySelector('#paypal-button-container');
    let payid = data.paymentAccountId.paypal;
    const response = await fetch(HOST_URL + `/api/paymentControl?payType=paypal&payid=${payid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let res = await response.json();
    if (res) {
      let paypalCurrency = (data.currency).toUpperCase();
      const paypalScript = document.createElement('script');
      paypalScript.src = `https://www.paypal.com/sdk/js?client-id=${res.clientId}&currency=${paypalCurrency}`;
      paypalScript.setAttribute("data-namespace", "paypal_sdk");
      document.body.appendChild(paypalScript);
      const paypalLoader = parentelement.querySelector('#paypal_loader');
      paypalLoader.style.display = 'none';
      paypalScript.onload = () => {
        paypal_sdk.Buttons({
          createOrder: function (data, actions) {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    currency_code: paypalCurrency,
                    value: total,
                  },
                },
              ],
            });
          },
          onApprove: async function (paydetail, actions) {
            const details = await actions.order.capture();
            widget_payment_checkout.style.display = 'none';
            tableSkeletonLoader(parentelement);
            const paypalbtn = parentelement.querySelector('#paypal-button-container');
            paypalbtn.style.display = 'none';
            let payinfo = {
              transactionId: details.purchase_units[0].payments.captures[0].id,
              name: `${details.payer.name.given_name} ${details.payer.name.surname}`,
              email: details.payer.email_address,
              paymentDate: details.purchase_units[0].payments.captures[0].create_time,
              price: details.purchase_units[0].payments.captures[0].amount.value,
              currency: details.purchase_units[0].payments.captures[0].amount.currency_code,
              status: details.status
            }
            bookingDetails.paymentInvoice = payinfo;
            let finaldata = {
              campaignID,
              campaignType: data.campaignID.type,
              visitorId: window[parentelementid + "_visitorId"],
              bookingDetails
            }
            let res = await saveData(parentelementid, finaldata);
            if (res === 1) {
              createThankYouSection(parentelementid, finaldata, data, displaySelectedData, parentelement);
            }
          }
        }).render(pyapalbutton);
      }
    }
  }
  else if (paymentType === 'cash') {
    tableSkeletonLoader(parentelement);
    bookingDetails.amount = total;
    bookingDetails.currency = data.currency;
    let finaldata = {
      campaignID,
      campaignType: data.campaignID.type,
      visitorId: window[parentelementid + "_visitorId"],
      bookingDetails
    }
    let res = await saveData(parentelementid, finaldata);
    if (res === 1) {
      createThankYouSection(parentelementid, finaldata, data, displaySelectedData, parentelement);
    }
  }
}
function backButtonClick(curDiv, prevDiv, parentelementid) {
  const parentelement = document.getElementById(parentelementid);
  const curDivele = parentelement.querySelector(`#${curDiv}`);
  const prevDivele = parentelement.querySelector(`#${prevDiv}`);
  curDivele.style.display = 'none';
  prevDivele.style.display = 'block';
}
function disableDates(holidays, businessDays, datepickerInput, dateAndTypeselect,disabledata) {
  function getNonBusinessDays(businessDays) {
    const dayOfWeekString = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const nonBusinessDaysIndexes = dayOfWeekString
      .map((day, index) => {
        const isNonBusinessDay = !businessDays.some(businessDay => businessDay.day === day);
        return isNonBusinessDay ? index : -1;
      })
      .filter(index => index !== -1);
    return nonBusinessDaysIndexes;
  }
  let nonBusinessDays = getNonBusinessDays(businessDays);
  let minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const datepicker = new AirDatepicker(datepickerInput, {
    locale: _defaultEN,
    minDate: minDate,
    onSelect({ date }) {
      datepicker.hide();
      dateAndTypeselect();
    },
    onRenderCell: function ({ date, cellType }) {
      if (cellType == 'day') {
        const dayOfWeek = date.getDay();
        const dateString = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        const formattedDate = date.toDateString();
        const isDisabled = holidays.includes(dateString) || nonBusinessDays.includes(dayOfWeek) || disabledata.includes(formattedDate);
        return {
          disabled: isDisabled
        };
      }
    }
  });
}
function customizeDateFormate(date) {
  const formattedDate = new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  return formattedDate
}
function startCountdown(parentelement, durationInSeconds, parentelementid) {

  let langData = window[parentelementid + "_lang"];

  let timer = durationInSeconds;
  const countdownElement = parentelement.querySelector('#widget_countdown');
  const verifiedstatus = parentelement.querySelector('#verifybtn');
  verifiedstatus.disabled = true;
  function updateCountdown() {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    if (langData[37]) {
      let formattedSentence = langData[37].replace(/\{seconds\}/g, `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
      countdownElement.textContent = formattedSentence;
    }
    else {
      countdownElement.textContent = `Resend OTP in ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
    if (--timer < 0) {
      clearInterval(interval);
      countdownElement.textContent = '';
      const verifiedstatus = parentelement.querySelector('#verifybtn');
      verifiedstatus.style.opacity = '1';
      if (langData[36]) {
        verifiedstatus.textContent = langData[36];
      } else {
        verifiedstatus.textContent = 'Resend OTP';
      }

      verifiedstatus.disabled = false;
      const isexsistEmail = parentelement.querySelector('#visitorEmail');
      isexsistEmail.disabled = false;
    }
  }
  updateCountdown();
  const interval = setInterval(updateCountdown, 1000);
}
async function emailVerify(campaignID, parentelement, parentelementid) {

  let langData = window[parentelementid + "_lang"];

  const verifiedstatus = parentelement.querySelector('#verifybtn');
  verifiedstatus.classList.add('button-loading');
  let inputElement = parentelement.querySelector('#visitorEmail');
  let errorElement = parentelement.querySelector(`#visitorEmail-error`);
  if (!isValidEmail(inputElement.value)) {
    errorElement.textContent = langData[42] ? langData[42] : `Please enter a valid email address`;
    verifiedstatus.classList.remove('button-loading');
  }
  else {
    errorElement.textContent = '';
    const response = await fetch(HOST_URL + `/api/auth/verification?email=${inputElement.value}&role=${2}&campaignId=${campaignID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let res = await response.json();
    if (res.verified == 1) {
      verifiedstatus.classList.remove('button-loading');
      verifiedstatus.innerHTML = '<svg version="1.1" width="51" height="51" fill="#07bc0c" viewBox="0 0 612 792" xmlns="http://www.w3.org/2000/svg"><g><path class="st0" d="M562,396c0-141.4-114.6-256-256-256S50,254.6,50,396s114.6,256,256,256S562,537.4,562,396L562,396z M501.7,296.3l-241,241l0,0l-17.2,17.2L110.3,421.3l58.8-58.8l74.5,74.5l199.4-199.4L501.7,296.3L501.7,296.3z"/></g></svg>';
      verifiedstatus.style.backgroundColor = 'white';
      verifiedstatus.style.padding = '0px';
      const otpContainer = parentelement.querySelector('#otpContainer');
      otpContainer.style.display = 'none';
      verifiedstatus.disabled = true;
      window[parentelementid + "_is_verify"] = true;
      window[parentelementid + "_visitorId"] = res.userId;
      const isexsistEmail = parentelement.querySelector('#visitorEmail');
      isexsistEmail.disabled = true;
    }
    else {
      verifiedstatus.classList.remove('button-loading');
      startCountdown(parentelement, 60, parentelementid);
      window[parentelementid + "_is_verify"] = false;
      window[parentelementid + "_visitorId"] = res.userId;
      verifiedstatus.textContent = langData[5] ? langData[5] : 'Verify';
      verifiedstatus.style.opacity = '0.5';
      const isexsistEmail = parentelement.querySelector('#visitorEmail');
      isexsistEmail.disabled = true;
      const otpContainer = parentelement.querySelector('#otpContainer');
      otpContainer.style.display = 'block';
    }
  }
}
async function checkOTP(parentelement, parentelementid) {

  let langData = window[parentelementid + "_lang"];

  const otpInputs = parentelement.querySelectorAll('.otp-input');
  const enteredOtp = Array.from(otpInputs).map(input => input.value).join('');
  const isValid = /^\d{6}$/.test(enteredOtp);
  let data = {
    otp: enteredOtp,
    userId: window[parentelementid + "_visitorId"],
  }
  if (isValid) {
    const response = await fetch(HOST_URL + `/api/auth/verification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    });
    let res = await response.json();
    if (res.status == 0) {
      const errorspan = parentelement.querySelector('#otp-error');
      if (res.error == 1) {
        errorspan.textContent = langData[45] ? langData[45] : res.message;
      }
      else if (res.error == 2) {
        errorspan.textContent = langData[86] ? langData[86] : res.message;
      }
      window[parentelementid + "_is_verify"] = false;
    }
    else {
      const otpContainer = parentelement.querySelector('#otpContainer');
      otpContainer.style.display = 'none';
      const verifiedstatus = parentelement.querySelector('#verifybtn');
      verifiedstatus.innerHTML = '<svg version="1.1" width="51" height="51" fill="#07bc0c" viewBox="0 0 612 792" xmlns="http://www.w3.org/2000/svg"><g><path class="st0" d="M562,396c0-141.4-114.6-256-256-256S50,254.6,50,396s114.6,256,256,256S562,537.4,562,396L562,396z M501.7,296.3l-241,241l0,0l-17.2,17.2L110.3,421.3l58.8-58.8l74.5,74.5l199.4-199.4L501.7,296.3L501.7,296.3z"/></g></svg>';
      verifiedstatus.style.opacity = '1';
      verifiedstatus.style.backgroundColor = 'white';
      verifiedstatus.style.padding = '0px';
      verifiedstatus.disabled = true;
      window[parentelementid + "_is_verify"] = true;
      window[parentelementid + "_visitorId"] = res.userId;
      const isexsistEmail = parentelement.querySelector('#visitorEmail');
      isexsistEmail.disabled = true;
    }
  }
  else {
    const errorspan = parentelement.querySelector('#otp-error');
    errorspan.textContent = langData[44] ? langData[44] : 'Invalid OTP. Please enter a 6-digit OTP.';
    window[parentelementid + "_is_verify"] = false
  }
}
//  Validation functionh
function validateForm(ifields, parentelement, parentelementid) {

  let langData = window[parentelementid + "_lang"];

  let isValid = true;
  ifields.forEach((field) => {
    let inputElement = parentelement.querySelector(`#${field.name}`);
    let errorElement = parentelement.querySelector(`#${field.name}-error`);
    const fieldName = field.label;
    errorElement.textContent = ``;
    if (inputElement) {
      const fieldType = inputElement.type;
      let spaceValidationRegex = /^\s*$/;
      const value = inputElement.value;
      if (fieldType !== 'radio' && fieldType !== 'checkbox') {
        if (!value || spaceValidationRegex.test(value)) {
          errorElement.textContent = langData[38] ? langData[38] : `Please enter a value.`;
          isValid = false;
        }
      }
      if (field?.type == 'date') {
        const inputValue = value?.trim();
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(inputValue)) {
          errorElement.textContent = langData[41] ? langData[41] : `Please select a date.`;
          isValid = false;
        }
      }
      if (field?.type == 'radio') {
        const radioButtons = parentelement.querySelectorAll(`input[name="${field.name}"]:checked`);
        if (radioButtons.length === 0) {
          errorElement.textContent = langData[40] ? langData[40] : `Please select a value.`;
          isValid = false;
        }
      }
      if (fieldType === 'email' && !isValidEmail(value)) {
        errorElement.textContent = langData[42] ? langData[42] : `Please enter a valid email address.`;
        isValid = false;
      } else if (fieldType === 'tel') {
        let phoneInput = parentelement.querySelector(`#${field.name}`)
        if (!value || !isValidPhone(phoneInput)) {
          errorElement.textContent = langData[43] ? langData[43] : `Please enter a valid phone number.`;
          isValid = false;
        }
      }
    } else {
      const radioButtons = parentelement.querySelectorAll(`input[name="${field.name}"]:checked`);
      if (radioButtons.length === 0) {
        errorElement.textContent = langData[40] ? langData[40] : `Please select a value.`;
        isValid = false;
      }
    }
  });
  return isValid;
}
function isValidEmail(email) {
  return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(email);
}
function isValidPhone(phoneInput) {
  // Get the intlTelInput instance
  const phoneInputInstance = window.intlTelInputGlobals.getInstance(phoneInput)
  const isValid = phoneInputInstance.isValidNumber();
  return isValid;
}
// Elements creation functions 
function timeSlotCreation(parentelementid, parentelement, selectedDate, data, timeSlotsContainer, bookedSlots) {

  let langData = window[parentelementid + "_lang"];

  const selectedDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][selectedDate.getDay()];
  const Hours = data.businessDays.find((day) => day.day === selectedDay);
  function isWithinBreakHours(startTime, endTime, breakHours) {
    const breakStart = new Date(breakHours.startTime);
    const breakEnd = new Date(breakHours.endTime);
    let endcheck = ((endTime).toLocaleTimeString() > (breakStart).toLocaleTimeString() && (endTime).toLocaleTimeString() <= (breakEnd).toLocaleTimeString());
    let stcheck = ((startTime).toLocaleTimeString() >= (breakStart).toLocaleTimeString() && (startTime).toLocaleTimeString() < (breakEnd).toLocaleTimeString());
    if (endcheck || stcheck) {
      return true;
    }
    return false;
  }
  if (Hours) {
    const startTime = new Date(Hours.businessHours.startTime);
    const endTime = new Date(Hours.businessHours.endTime);
    let appointSlot;
    let createdSlot = 0;
    if (data.appointmentTimeSlot) {
      appointSlot = data.appointmentTimeSlot * 60 * 1000  // in case of appointment 
    } else {
      appointSlot = data.reservationSlot * 60 * 1000   // in case of seat and table booking
    }
    while (startTime < endTime) {
      const endtimeslot = new Date(startTime.getTime() + appointSlot);
      if (!isWithinBreakHours(startTime, endtimeslot, Hours.breakHours)) {
        const slotTime = new Date(startTime);
        const slotEndTime = new Date(startTime.getTime() + appointSlot);
        if (slotEndTime > endTime) {
          break;
        }
        let isStartTimeIncluded = false;
        if (bookedSlots) {
          isStartTimeIncluded = bookedSlots.some(slot => {
            return startTime.toLocaleTimeString() == slot;
          });
        }
        if (!isStartTimeIncluded) {
          createdSlot++;
          const timeSlotdiv = document.createElement('div');
          timeSlotdiv.classList.add('widget_radio_wrap_timeslot');
          const timeSlotElement = document.createElement('input');
          timeSlotElement.type = 'radio';
          timeSlotElement.name = 'timeSlot';
          timeSlotElement.value = `${slotTime}`;
          timeSlotElement.id = `slot_${slotTime.getTime()}`;
          const label = document.createElement('label');
          const span = document.createElement('span');
          span.textContent = `${slotTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${slotEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
          label.setAttribute('for', `slot_${slotTime.getTime()}`);
          timeSlotdiv.appendChild(timeSlotElement);
          timeSlotdiv.appendChild(span);
          label.appendChild(timeSlotdiv);
          timeSlotsContainer.appendChild(label);
          // Add event listener to the radio button
          timeSlotElement.addEventListener('change', function () {
            // Remove "active" class from all time slots
            const allTimeSlots = document.querySelectorAll('.widget_radio_wrap_timeslot');
            allTimeSlots.forEach(slot => {
              slot.classList.remove('timesolt_active');
            });
            // Add "active" class to the parent of the checked radio button
            if (this.checked) {
              timeSlotdiv.classList.add('timesolt_active');
            }
          });
        }
      }
      startTime.setTime(startTime.getTime() + appointSlot);
    }
    if (createdSlot == 0) {
      let timeslots = parentelement.querySelector('#timeSlots');
      timeslots.style.display = 'none'
      let bookedmessage = parentelement.querySelector('#bookedmessage')
      bookedmessage.style.display = 'block'
      bookedmessage.textContent = langData[55] ? langData[55] : 'Oops! No slots available for choosen date, try to choose different date. Thank you!';
    }
  } else {
    let timeslots = parentelement.querySelector('#timeSlots');
    timeslots.style.display = 'none'
    let bookedmessage = parentelement.querySelector('#bookedmessage')
    bookedmessage.style.display = 'block'
    bookedmessage.textContent = langData[56] ? langData[56] : 'No slots available for this day.';
  }
}
function emailfieldcreation(nameFieldsElement, emailFieldsElement, campaignID, parentelement, parentelementid) {

  let langData = window[parentelementid + "_lang"];

  const nameinputdiv = document.createElement('div');
  const namelabel = document.createElement('label');
  namelabel.textContent = langData[6] ? langData[6] : 'Name';
  nameinputdiv.classList.add('widget_ipt_wrap')
  const nameinput = document.createElement('input');
  const nameerrorspan = document.createElement('span');
  nameerrorspan.id = `Name-error`;
  nameerrorspan.classList.add('error');
  nameinput.type = 'text';
  nameinput.id = 'Name';
  nameinputdiv.appendChild(namelabel);
  nameinputdiv.appendChild(nameinput);
  nameinputdiv.appendChild(nameerrorspan);
  nameFieldsElement.appendChild(nameinputdiv);
  const inputdiv = document.createElement('div');
  const label = document.createElement('label');
  label.textContent = langData[7] ? langData[7] : 'Email';
  inputdiv.classList.add('widget_ipt_wrap')
  const outerDiv = document.createElement('div');
  outerDiv.classList.add('widget_email_field_wrap')
  const input = document.createElement('input');
  const errorspan = document.createElement('span');
  errorspan.id = `visitorEmail-error`;
  errorspan.classList.add('error');
  input.type = 'email';
  input.id = 'visitorEmail';
  const otpContainer = document.createElement('div');
  otpContainer.id = 'otpContainer';
  otpContainer.classList.add('otpContainer_wrap');
  const errorotp = document.createElement('span');
  errorotp.id = `otp-error`;
  errorotp.classList.add('otp_error');
  const otpInput = document.createElement('div');
  otpInput.id = 'otpInput';
  otpInput.classList.add('otp_input_wrap')
  const otpLabel = document.createElement('label');
  otpLabel.textContent = langData[35] ? langData[35] : 'Enter OTP :';
  otpContainer.appendChild(otpLabel);
  const verifyButton = document.createElement('button');
  verifyButton.classList.add('widget_btn_css');
  verifyButton.textContent = langData[5] ? langData[5] : 'Verify';
  verifyButton.id = 'verifybtn';
  verifyButton.type = 'button';
  verifyButton.onclick = () => emailVerify(campaignID, parentelement, parentelementid);
  outerDiv.appendChild(input);
  outerDiv.appendChild(verifyButton);
  inputdiv.appendChild(label);
  inputdiv.appendChild(outerDiv);
  inputdiv.appendChild(errorspan);
  for (let i = 1; i <= 6; i++) {
    const otpinp = document.createElement('input');
    otpinp.classList.add('otp-input');
    otpinp.maxLength = 1;
    otpinp.type = 'text';
    otpinp.addEventListener('input', (event) => {
      const nextInput = event.target.nextElementSibling;
      if (nextInput && event.target.value !== '') {
        nextInput.focus();
      }
    });
    otpinp.addEventListener('keydown', (event) => {
      const prevInput = event.target.previousElementSibling;
      if (event.code === 'Backspace') {
        if (!event.target.value && prevInput) {
          prevInput.focus();
        }
      }
    });
    otpInput.appendChild(otpinp);
  }
  const submitButton = document.createElement('button');
  submitButton.classList.add('widget_btn_css');
  submitButton.textContent = langData[30] ? langData[30] : 'Submit';
  submitButton.type = 'button';
  submitButton.onclick = () => checkOTP(parentelement, parentelementid);;
  otpInput.appendChild(submitButton);
  const countdown = document.createElement('div');
  countdown.id = 'widget_countdown';
  countdown.classList.add('countdown_css');
  otpContainer.style.display = 'none';
  otpContainer.appendChild(otpInput);
  otpContainer.appendChild(errorotp);
  otpContainer.appendChild(countdown);
  emailFieldsElement.appendChild(inputdiv);
  emailFieldsElement.appendChild(otpContainer);
}
function inputFieldsCreation(parentelementid, data, ifields, InputFieldsElement) {

  let langData = window[parentelementid + "_lang"];

  data.formFields.forEach((field, i) => {
    const inputdiv = document.createElement('div');
    const label = document.createElement('label');
    label.textContent = field.label;
    if (field.inputType === 'radio') {
      inputdiv.classList.add('widget_group_radio')
      const errorspan = document.createElement('span');
      errorspan.id = `${field.label}-error`;
      errorspan.classList.add('error');
      const radioOptions = field.options;
      inputdiv.appendChild(label);
      // Create a radio button for each option
      radioOptions.forEach((option, index) => {
        const paydiv = document.createElement('div');
        paydiv.classList.add('widget_radio_wrap');
        const radioInput = document.createElement('input');
        radioInput.type = 'radio';
        radioInput.name = field.label;
        radioInput.id = option;
        radioInput.value = option;
        radioInput.checked = false
        const radioLabel = document.createElement('label');
        radioLabel.textContent = option;
        radioLabel.htmlFor = radioInput.id;
        paydiv.appendChild(radioInput);
        paydiv.appendChild(radioLabel);
        inputdiv.appendChild(paydiv)
      });
      inputdiv.appendChild(errorspan)
      ifields.push({
        label: field.label,
        name: field.label,
        type: 'radio'
      })
    }
    else if (field.inputType === 'checkbox') {
      inputdiv.classList.add('widget_ipt_checkbox');
      const input = document.createElement('input');
      const errorspan = document.createElement('span');
      errorspan.id = `${field.label}-error`;
      errorspan.classList.add('error');
      input.type = field.inputType;
      input.name = field.label;
      ifields.push({
        label: field.label,
        name: field.label
      })
      inputdiv.appendChild(input);
      inputdiv.appendChild(label);
      inputdiv.appendChild(errorspan);
    }
    else if (field.inputType === 'select') {
      const selectOptions = field.options;
      inputdiv.classList.add('widget_ipt_wrap')
      const input = document.createElement('select');
      const errorspan = document.createElement('span');
      errorspan.id = `${field.label}-error`;
      errorspan.classList.add('error');
      input.type = field.inputType;
      input.id = field.label;
      input.name = field.label;
      const defaultOption = document.createElement('option');
      defaultOption.textContent = langData[33] ? langData[33] : 'Please select an option';
      defaultOption.value = '';
      input.appendChild(defaultOption);
      selectOptions.forEach((option, index) => {
        const optionele = document.createElement('option');
        optionele.textContent = option;
        optionele.value = option;
        input.appendChild(optionele)
      });
      ifields.push({
        label: field.label,
        name: field.label
      })
      inputdiv.appendChild(label);
      inputdiv.appendChild(input);
      inputdiv.appendChild(errorspan)
    }
    else if (field.inputType === 'tel') {
      inputdiv.classList.add('widget_ipt_wrap')
      const input = document.createElement('input');
      const errorspan = document.createElement('span');
      errorspan.id = `${field.label}-error`;
      errorspan.classList.add('error');
      input.type = field.inputType;
      input.id = field.label;
      ifields.push({
        label: field.label,
        name: field.label
      });
      inputdiv.appendChild(label);
      inputdiv.appendChild(input);
      // InputFieldsElement.appendChild(input);
      const phone = window.intlTelInput(input, {
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js"
      });
      inputdiv.appendChild(errorspan);
      // Add the input to the DOM before initializing intlTelInput
    }
    else if (field.inputType === 'date') {
      inputdiv.classList.add('widget_ipt_wrap')
      const errorspan = document.createElement('span');
      errorspan.id = `${field.label}-error`;
      errorspan.classList.add('error');
      const datepickerInput = document.createElement('input');
      datepickerInput.type = 'text';
      datepickerInput.id = field.label;
      let dateinp = new AirDatepicker(datepickerInput, {
        locale: _defaultEN,
        maxDate: Date.now(),
      });
      inputdiv.appendChild(label);
      inputdiv.appendChild(datepickerInput);
      ifields.push({
        label: field.label,
        name: field.label,
        type: 'date'
      })
      inputdiv.appendChild(errorspan);
    }
    else if (field.inputType === 'groupCheckBox') {
      inputdiv.classList.add('widget_group_radio')
      inputdiv.appendChild(label);
      const errorspan = document.createElement('span');
      errorspan.id = `${field.label}-error`;
      errorspan.classList.add('error');
      const checkboxOptions = field.options;
      checkboxOptions.forEach((option, index) => {
        const inputcheckbox = document.createElement('div');
        inputcheckbox.classList.add('widget_ipt_checkbox')
        inputcheckbox.style.marginBottom = '0px';
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.name = field.label;
        input.id = option;
        input.value = option;
        const checkboxLabel = document.createElement('label');
        checkboxLabel.textContent = option;
        checkboxLabel.htmlFor = input.id;
        inputcheckbox.appendChild(input);
        inputcheckbox.appendChild(checkboxLabel);
        inputdiv.appendChild(inputcheckbox);
      });
      inputdiv.appendChild(errorspan);
      ifields.push({
        label: field.label,
        name: field.label,
        type: 'radio'
      })
    }
    else {
      inputdiv.classList.add('widget_ipt_wrap')
      const input = document.createElement('input');
      const errorspan = document.createElement('span');
      errorspan.id = `${field.label}-error`;
      errorspan.classList.add('error');
      input.type = field.inputType;
      input.id = field.label;
      ifields.push({
        label: field.label,
        name: field.label
      })
      inputdiv.appendChild(label);
      inputdiv.appendChild(input);
      inputdiv.appendChild(errorspan)
    }
    InputFieldsElement.appendChild(inputdiv);
  });
}
function ticketGeneration(parentelementid, parentelement, typesArray, campaignType, selectedtickets, ticketOptions, reservationType, total, bookedSlots, currency, selectCount, displaySelectedData) {

  let langData = window[parentelementid + "_lang"];

  const soldOutbtn = parentelement.querySelector('#soldOutbtn');
  if (soldOutbtn) { soldOutbtn.style.display = 'none' }
  let bookedCount = 0;
  typesArray.forEach((ele) => {
    let available = 0;
    if (campaignType == 'event') {
      available = ele.booked ? ele.numberOfTickets - ele.booked : ele.numberOfTickets;
    }
    if (campaignType == 'booking') {
      if (bookedSlots && bookedSlots.hasOwnProperty(ele.id)) {
        available = (reservationType == 'table' ? (ele.numberOfTables - bookedSlots[ele.id]) : ele.numberOfSeats - bookedSlots[ele.id])
      }
      else {
        available = (reservationType == 'table' ? ele.numberOfTables : ele.numberOfSeats)
      }
    }
    const ticketDiv = document.createElement('div');
    ticketDiv.classList.add('widget_ticket_box');
    const ticketNameCoutnWrap = document.createElement('div')
    ticketNameCoutnWrap.classList.add('widget_ticket_upper_part');
    const ticketNameWrap = document.createElement('div');
    ticketNameWrap.classList.add('widget_ticket_name_wrap');
    const widget_name_div = document.createElement('div');
    const noofpersons = document.createElement('div');
    if (campaignType == 'booking') {
      widget_name_div.classList.add('widget_name_div');
      if (reservationType == 'table') {
        noofpersons.textContent = langData[78] ? langData[78].replace(/\{personPerTable\}/g, ele.personPerTable) : `No of Person - ${ele.personPerTable}`;
      }
    }
    const ticketTitle = document.createElement('h5');
    if (campaignType == 'booking') { ticketTitle.textContent = ele.name; }
    else { ticketTitle.textContent = ele.title; }
    const ticketPrice = document.createElement('span');
    ticketPrice.textContent = ele.price == 0 ? (langData[12] ? langData[12] : `Free`) : `${widgetCurrency[currency]} ${ele.price}`;
    const ticketCountRightWrap = document.createElement('div');
    ticketCountRightWrap.classList.add('widget_upper_right_box');
    const ticketCountDiv = document.createElement('div');
    ticketCountDiv.classList.add('widget_ticket_count');
    if (available > 0) {
      const decrementButton = document.createElement('span');
      decrementButton.textContent = '-';
      const ticketCountSpan = document.createElement('span');
      ticketCountSpan.textContent = '0'; // Initialize the count to zero
      const incrementButton = document.createElement('span');
      incrementButton.textContent = '+';
      // Add click listeners for increment and decrement
      decrementButton.addEventListener('click', () => {
        decrementCount(ticketCountSpan, ele);
      });
      incrementButton.addEventListener('click', () => {
        incrementCount(ticketCountSpan, ele, available);
      });
      ticketCountDiv.appendChild(decrementButton);
      ticketCountDiv.appendChild(ticketCountSpan);
      ticketCountDiv.appendChild(incrementButton);
    } else {
      ticketCountDiv.textContent = langData[28] ? langData[28] : 'Sold Out';
      bookedCount++;
    }
    if (campaignType == 'booking') {
      widget_name_div.appendChild(ticketTitle);
      widget_name_div.appendChild(ticketPrice);
      ticketNameWrap.appendChild(widget_name_div);
      if (reservationType == 'table') ticketNameWrap.appendChild(noofpersons);
    } else {
      ticketNameWrap.appendChild(ticketTitle);
      ticketNameWrap.appendChild(ticketPrice);
    }
    ticketNameCoutnWrap.appendChild(ticketNameWrap);
    ticketCountRightWrap.appendChild(ticketCountDiv);
    ticketNameCoutnWrap.appendChild(ticketCountRightWrap);
    const ticketDesAvai = document.createElement('div')
    ticketDesAvai.classList.add('widget_ticket_upper_part_desc');
    const descriptionP = document.createElement('p');
    descriptionP.textContent = langData[13] ? `${langData[13]} : ${ele.description}` : `Description: ${ele.description}`;
    const avaTicket = document.createElement('div');
    avaTicket.classList.add('widget_available');
    if (available > 0) {
      avaTicket.textContent = langData[14] ? `${langData[14]} : ${available}` : `Available : ${available}`;
    } else {
      avaTicket.style.backgroundColor = 'grey';
      avaTicket.textContent = langData[15] ? langData[15] : `Unavailable`;
    }
    ticketDesAvai.appendChild(descriptionP);
    ticketDesAvai.appendChild(avaTicket);
    ticketDiv.appendChild(ticketNameCoutnWrap);
    ticketDiv.appendChild(ticketDesAvai);
    ticketOptions.appendChild(ticketDiv);
  })
  if (bookedCount >= typesArray.length) {
    const soldOutMsg = parentelement.querySelector('#soldOutMsg');
    const ticketSelect = parentelement.querySelector('#ticketSelect');
    ticketSelect.style.display = 'none'
    const soldOutbtn = parentelement.querySelector('#soldOutbtn');
    soldOutbtn.style.display = 'block'
    if (campaignType == 'event') {
      soldOutMsg.textContent = langData[69] ? langData[69] : "Sorry, all tickets for this event have been booked. We're fully sold out! Please stay tuned for our future updates. Thank you for your interest!"
    } else {
      let widget_datetime = parentelement.querySelector('#widget_datetime')
      widget_datetime.style.display = 'block';
      soldOutMsg.textContent = langData[85] ? langData[85].replace(/\{reservationType\}/g, reservationType) : `Sorry, currently no ${reservationType}s available for choosen date and time. Try selecting another date and time. Thank you for your interest!`;
    }
  }
  const totalAmountSpan = parentelement.querySelector('#totalAmount');
  const campaignCurrency = parentelement.querySelector('#campaignCurrency')
  // Function to update the total amount
  function updateTotal(ele, unit) {
    if (unit == 'inc') {
      total += parseFloat(ele.price);
      total = parseFloat(total.toFixed(2));
    }
    else if (unit == 'dec') {
      total -= parseFloat(ele.price);
      total = parseFloat(total.toFixed(2));
    }
    campaignCurrency.textContent = `${(currency != undefined) ? `${widgetCurrency[currency]}  ` : ''}`
    totalAmountSpan.textContent = total;
  }
  function incrementCount(ticketCountSpan, ele, available) {
    const count = parseInt(ticketCountSpan.textContent);
    if (selectCount) { selectCount.count++; }
    if (count < available) {
      selectedtickets[ele.id] = count + 1;
      ticketCountSpan.textContent = (count + 1).toString();
      updateTotal(ele, unit = 'inc');
      displaySelectedData[ele.id] = ele;
    }
  }
  function decrementCount(ticketCountSpan, ele) {
    const count = parseInt(ticketCountSpan.textContent);
    if (selectCount) { selectCount.count++; }
    if (count > 0) {
      selectedtickets[ele.id] = count - 1;
      if (selectedtickets[ele.id] == 0) delete selectedtickets[ele.id];
      ticketCountSpan.textContent = (count - 1).toString();
      updateTotal(ele, unit = 'dec');
    }
  }
}
async function RoomGeneration(parentelementid, parentelement, roomsType, campaignID, selectedRooms, roomOptions, total, bookedSlots, currency, displaySelectedData) {

  let langData = window[parentelementid + "_lang"];

  let imageArray = [];
  let response = await fetch(HOST_URL + `/api/user/image?id=${campaignID}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }
  else {
    let data = await response.json();
    imageArray = imageArray.concat(data.camp_images);
  }
  let bookedCount = 0;
  roomsType.forEach((ele, index) => {
    let available = 0;
    if (bookedSlots && bookedSlots.hasOwnProperty(ele.id)) {
      available = ele.numberOfRooms - bookedSlots[ele.id];
    }
    else {
      available = ele.numberOfRooms;
    }
    const matchedImages = imageArray.filter(item => ele.images.includes(item._id));
    const imageUrls = matchedImages.map(item => item.image);
    // Create the main wrapper div
    const widgetRoomTypeWrapper = document.createElement('div');
    widgetRoomTypeWrapper.classList.add('widget_room_type_wrapper');
    // Create the image section div
    const widgetRoomImageSection = document.createElement('div');
    widgetRoomImageSection.classList.add('widget_room_image_section');
    // Create and append three images
    for (let i = 0; i < imageUrls.length; i++) {
      const img = document.createElement('img');
      img.classList.add('widget_img_display');
      if (i === 0) img.style.display = "block";
      img.src = imageUrls[i]; // Replace with the actual image source
      widgetRoomImageSection.appendChild(img);
    }
  
    let imageCount = widgetRoomImageSection.getElementsByTagName('img');
   
    // Create the "Previous" button
    if(imageCount?.length > 1){
    const prevButton = document.createElement('button');
    prevButton.classList.add('widget_slider_left');
    prevButton.id = 'prev';
    prevButton.onclick = function () {
      plusDivs(-1, index + 1);
    };
    const prevSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    prevSvg.setAttribute('version', '1.2');
    prevSvg.setAttribute('width', '8');
    prevSvg.setAttribute('height', '12');
    prevSvg.innerHTML = `
<path fill="#fff"
id="Shape 850"
d="m1.2 6.5l5.3-5.3q0.2-0.2 0.5-0.2 0.2 0 0.4 0.2l0.4 0.4c0.3 0.2 0.3 0.7 0 0.9l-4.4 4.5 4.4 4.5q0.2 0.2 0.2 0.4 0 0.3-0.2 0.5l-0.4 0.4q-0.2 0.2-0.4 0.2-0.3 0-0.5-0.2l-5.3-5.3q-0.2-0.2-0.2-0.5 0-0.3 0.2-0.5z"
/>
`;
    prevButton.appendChild(prevSvg);
    // Create the "Next" button
    const nextButton = document.createElement('button');
    nextButton.classList.add('widget_slider_right');
    nextButton.id = 'next';
    nextButton.onclick = function () {
      plusDivs(1, index + 1);
    };
    const nextSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    nextSvg.setAttribute('version', '1.2');
    nextSvg.setAttribute('width', '8');
    nextSvg.setAttribute('height', '12');
    nextSvg.innerHTML = `
<path fill="#fff"

id="Shape 850"
d="m8.8 6.5l-5.3-5.3q-0.2-0.2-0.5-0.2-0.2 0-0.4 0.2l-0.4 0.4c-0.3 0.2-0.3 0.7 0 0.9l4.4 4.5-4.4 4.5q-0.2 0.2-0.2 0.4 0 0.3 0.2 0.5l0.4 0.4q0.2 0.2 0.4 0.2 0.3 0 0.5-0.2l5.3-5.3q0.2-0.2 0.2-0.5 0-0.3-0.2-0.5z"
/>
`;
    nextButton.appendChild(nextSvg);
    // Append the buttons to the image section
    widgetRoomImageSection.appendChild(prevButton);
    widgetRoomImageSection.appendChild(nextButton);}
    // Create the right detail div
    const widgetRoomDetailRight = document.createElement('div');
    widgetRoomDetailRight.classList.add('widget_room_detail_right');
    // Create the name box
    const widgetRoomNameBox = document.createElement('div');
    widgetRoomNameBox.classList.add('widget_room_name_box');
    // Create and append the name and description elements (h3 and two p elements)
    const name = document.createElement('h3');
    name.textContent = ele.name;
    widgetRoomNameBox.appendChild(name);
    // Create the "Available" div
    const widgetRoomAvailable = document.createElement('div');
    widgetRoomAvailable.classList.add('widget_room_available');
    if (available > 0) {
      widgetRoomAvailable.textContent = langData[14] ? `${langData[14]} : ${available}` : `Available : ${available}`;
    }
    else {
      bookedCount++;
      widgetRoomAvailable.style.backgroundColor = 'grey';
      widgetRoomAvailable.textContent = langData[15] ? langData[15] : 'Unavailable';
    }
    // Append the "Available" div to the name box
    widgetRoomNameBox.appendChild(widgetRoomAvailable);
    const description = document.createElement('p');
    description.textContent = ele.description;
    const person = document.createElement('p');
    person.textContent = langData[77] ? langData[77] + `:- ${ele.personPerRoom}` : `Person per Room :- ${ele.personPerRoom}`;
    widgetRoomDetailRight.appendChild(widgetRoomNameBox);
    widgetRoomDetailRight.appendChild(description);
    widgetRoomDetailRight.appendChild(person);
    // Create the pricing div
    const widgetRoomPricing = document.createElement('div');
    widgetRoomPricing.classList.add('widget_room_pricing');
    // Create and append the price element (p) and the "Book" button
    const price = document.createElement('p');
    price.classList.add('widget_room_price');
    price.textContent = `${widgetCurrency[currency]} ${ele.price}`;
    widgetRoomPricing.appendChild(price);
    // Increateent decremenet Handle 
    if (available > 0) {
      const RoomCountDiv = document.createElement('div');
      RoomCountDiv.classList.add('widget_ticket_count');
      const decrementButton = document.createElement('span');
      decrementButton.textContent = '-';
      const roomCountSpan = document.createElement('span');
      roomCountSpan.textContent = '0'; // Initialize the count to zero
      const incrementButton = document.createElement('span');
      incrementButton.textContent = '+';
      // Add click listeners for increment and decrement
      decrementButton.addEventListener('click', () => {
        decrementCount(roomCountSpan, ele);
      });
      incrementButton.addEventListener('click', () => {
        incrementCount(roomCountSpan, ele, available);
      });
      RoomCountDiv.appendChild(decrementButton);
      RoomCountDiv.appendChild(roomCountSpan);
      RoomCountDiv.appendChild(incrementButton);
      widgetRoomPricing.appendChild(RoomCountDiv)
    }
    // widgetRoomPricing.appendChild(bookButton);
    // Append the image section, right detail, and pricing to the main wrapper
    widgetRoomTypeWrapper.appendChild(widgetRoomImageSection);
    widgetRoomTypeWrapper.appendChild(widgetRoomDetailRight);
    widgetRoomTypeWrapper.appendChild(widgetRoomPricing);
    // Append the main wrapper to the document body or any other desired container
    roomOptions.appendChild(widgetRoomTypeWrapper);
    if (bookedCount >= roomsType.length) {
      const soldOutMsg = parentelement.querySelector('#soldOutMsg');
      const ifAvailable = parentelement.querySelector('#ifAvailable');
      ifAvailable.style.display = 'none'
      const roomTypes = parentelement.querySelector('#roomTypes');
      roomTypes.style.display = 'none'
      const soldOutbtn = parentelement.querySelector('#soldOutbtn');
      soldOutbtn.style.display = 'block'
      const selectCheckInOut = parentelement.querySelector('#selectCheckInOut');
      selectCheckInOut.style.display = 'block'
      soldOutMsg.textContent = langData[83] ? langData[83] : "Oops!, currently no rooms available for choosen dates. Try to select different dates. Thank you for your interest!"
    }
    else {
      const ifAvailable = parentelement.querySelector('#ifAvailable');
      ifAvailable.style.display = 'block'
      const soldOutbtn = parentelement.querySelector('#soldOutbtn');
      soldOutbtn.style.display = 'none'
    }
    const totalAmountSpan = parentelement.querySelector('#totalAmount');
    const campaignCurrency = parentelement.querySelector('#campaignCurrency');
    // Function to update the total amount
    function updateTotal(ele, unit) {
      if (unit == 'inc') {
        total += parseFloat(ele.price);
        total = parseFloat(total.toFixed(2));
      }
      else if (unit == 'dec') {
        total -= parseFloat(ele.price);
        total = parseFloat(total.toFixed(2));
      }
      campaignCurrency.textContent = `${(currency != undefined) ? `${widgetCurrency[currency]}  ` : ''}`
      totalAmountSpan.textContent = total;
    }
    function incrementCount(roomCountSpan, ele, available) {
      const count = parseInt(roomCountSpan.textContent);
      if (count < available) {
        selectedRooms[ele.id] = count + 1;
        roomCountSpan.textContent = (count + 1).toString();
        updateTotal(ele, unit = 'inc');
        displaySelectedData[ele.id] = ele;
      }
    }
    function decrementCount(roomCountSpan, ele) {
      const count = parseInt(roomCountSpan.textContent);
      if (count > 0) {
        selectedRooms[ele.id] = count - 1;
        if (selectedRooms[ele.id] == 0) delete selectedRooms[ele.id];
        roomCountSpan.textContent = (count - 1).toString();
        updateTotal(ele, unit = 'dec');
      }
    }
  })
  const slideIndexArray = [];
  function initSlideIndex(numOfRoomTypes) {
    for (let i = 0; i < numOfRoomTypes; i++) {
      slideIndexArray.push(1);
    }
  }
  initSlideIndex(roomsType.length);
  function plusDivs(n, roomTypeIndex) {
    slideIndexArray[roomTypeIndex - 1] += n;
    showDivs(slideIndexArray[roomTypeIndex - 1], roomTypeIndex);
  }
  function showDivs(n, roomTypeIndex) {
    const x = document
      .querySelectorAll(".widget_room_type_wrapper")
    [roomTypeIndex - 1].getElementsByClassName("widget_img_display");
    if (n > x.length) {
      slideIndexArray[roomTypeIndex - 1] = 1;
    }
    if (n < 1) {
      slideIndexArray[roomTypeIndex - 1] = x.length;
    }
    for (let i = 0; i < x.length; i++) {
      x[i].style.display = "none";
    }
    x[slideIndexArray[roomTypeIndex - 1] - 1].style.display = "block";
  }
}
function paymentOptionCreation(data, payMethods, parentelementid) {
  let langData = window[parentelementid + "_lang"];

  data.paymentMethod.forEach((method) => {
    const paydiv = document.createElement('div');
    paydiv.classList.add('widget_radio_wrap');
    const option = document.createElement('input');
    option.type = 'radio';
    option.name = 'paymentType';
    option.value = method;
    option.id = method;
    const label = document.createElement('label');
    if (method == 'paypal') {
      label.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="80" height="26" viewBox="-11.153 -13.144 326.05 105.914" id="paypal"><g transform="matrix(2.07675 0 0 -2.07675 -11.153 92.77)"><defs><path id="a" d="M-84.525-27.457h326.05V78.457h-326.05z"></path></defs><clipPath id="b"><use overflow="visible" xlink:href="#a"></use></clipPath><g clip-path="url(#b)"><path fill="#003087" d="M32.419 40.982c-1.674 1.908-4.7 2.726-8.571 2.726H12.613a1.609 1.609 0 0 1-1.59-1.357L6.347 12.68a.964.964 0 0 1 .953-1.114h6.936l1.742 11.049-.054-.346a1.604 1.604 0 0 0 1.583 1.357h3.296c6.475 0 11.545 2.63 13.026 10.238.044.225.082.444.115.658.44 2.812-.003 4.726-1.524 6.459"></path><path fill="#009cde" d="M117.331 26.863c-.424-2.784-2.55-2.784-4.606-2.784h-1.17l.821 5.198c.05.314.32.545.638.545h.537c1.4 0 2.722 0 3.404-.797.407-.477.53-1.185.376-2.162m-.895 7.264h-7.756a1.08 1.08 0 0 1-1.066-.91L104.48 13.33a.647.647 0 0 1 .638-.747h3.98c.371 0 .687.27.745.636l.89 5.64c.082.523.534.91 1.064.91h2.454c5.11 0 8.058 2.471 8.828 7.372.347 2.142.014 3.826-.989 5.005-1.103 1.296-3.058 1.982-5.653 1.982"></path><path fill="#003087" d="M62.011 26.863c-.424-2.784-2.55-2.784-4.607-2.784h-1.17l.821 5.198c.05.314.32.545.638.545h.537c1.4 0 2.722 0 3.404-.797.408-.477.531-1.185.377-2.162m-.895 7.264H53.36c-.53 0-.982-.386-1.065-.91L49.16 13.33a.646.646 0 0 1 .638-.747h3.704c.53 0 .981.386 1.064.91l.847 5.365c.082.524.534.91 1.064.91h2.454c5.11 0 8.058 2.472 8.828 7.373.347 2.142.014 3.826-.989 5.005-1.103 1.296-3.058 1.982-5.653 1.982M79.123 19.723c-.36-2.122-2.043-3.547-4.192-3.547-1.077 0-1.94.347-2.494 1.003-.55.65-.756 1.577-.582 2.608.334 2.104 2.046 3.574 4.162 3.574 1.055 0 1.91-.35 2.476-1.012.569-.667.793-1.599.63-2.626m5.176 7.23h-3.714a.647.647 0 0 1-.64-.547l-.162-1.038-.26.376c-.804 1.167-2.597 1.558-4.387 1.558-4.103 0-7.608-3.11-8.29-7.47-.355-2.177.149-4.256 1.383-5.707 1.133-1.333 2.75-1.888 4.677-1.888 3.308 0 5.142 2.124 5.142 2.124l-.166-1.032a.646.646 0 0 1 .639-.747h3.344c.53 0 .982.385 1.065.91l2.008 12.713a.647.647 0 0 1-.64.747"></path><path fill="#009cde" d="M134.443 19.723c-.36-2.122-2.043-3.547-4.192-3.547-1.077 0-1.94.347-2.494 1.003-.55.65-.756 1.577-.582 2.608.334 2.104 2.045 3.574 4.162 3.574 1.055 0 1.91-.35 2.476-1.012.569-.667.793-1.599.63-2.626m5.176 7.23h-3.714a.647.647 0 0 1-.64-.547l-.162-1.038-.26.376c-.804 1.167-2.597 1.558-4.387 1.558-4.102 0-7.607-3.11-8.29-7.47-.355-2.177.15-4.256 1.384-5.707 1.133-1.333 2.75-1.888 4.677-1.888 3.309 0 5.143 2.124 5.143 2.124l-.166-1.032a.644.644 0 0 1 .637-.747h3.343c.53 0 .982.385 1.066.91l2.008 12.713a.647.647 0 0 1-.64.747"></path><path fill="#003087" d="M104.08 26.952h-3.734c-.357 0-.69-.177-.89-.473l-5.15-7.584-2.183 7.288a1.08 1.08 0 0 1-1.033.77h-3.669a.647.647 0 0 1-.612-.856l4.11-12.066-3.866-5.455a.647.647 0 0 1 .528-1.02h3.73c.352 0 .683.173.885.463l12.414 17.918a.646.646 0 0 1-.53 1.015"></path><path fill="#009cde" d="M143.996 33.58l-3.184-20.251a.647.647 0 0 1 .639-.747h3.201c.53 0 .982.386 1.065.91l3.139 19.888a.646.646 0 0 1-.639.747h-3.582a.645.645 0 0 1-.639-.546"></path><path fill="#003087" d="M32.419 40.982c-1.674 1.908-4.7 2.726-8.571 2.726H12.613a1.609 1.609 0 0 1-1.59-1.357L6.347 12.68a.964.964 0 0 1 .953-1.114h6.936l1.742 11.049-.054-.346a1.604 1.604 0 0 0 1.583 1.357h3.296c6.475 0 11.545 2.63 13.026 10.238.044.225.082.444.115.658.44 2.812-.003 4.726-1.524 6.459"></path><path fill="#003087" d="M17.849 34.485a1.408 1.408 0 0 0 1.389 1.187h8.808c1.043 0 2.016-.068 2.905-.21a12.206 12.206 0 0 0 1.44-.322 7.957 7.957 0 0 0 1.551-.618c.442 2.813-.002 4.726-1.523 6.46-1.675 1.907-4.7 2.725-8.571 2.725H12.612a1.609 1.609 0 0 1-1.588-1.357L6.346 12.682a.964.964 0 0 1 .952-1.115h6.937l1.742 11.05 1.872 11.868z"></path><path fill="#009cde" d="M33.943 34.523a18.294 18.294 0 0 0-.115-.658c-1.481-7.607-6.551-10.238-13.026-10.238h-3.297a1.602 1.602 0 0 1-1.582-1.357l-1.688-10.702-.48-3.036a.844.844 0 0 1 .834-.976h5.847c.692 0 1.28.504 1.389 1.187l.057.298 1.102 6.984.07.386a1.407 1.407 0 0 0 1.39 1.187h.875c5.664 0 10.099 2.3 11.395 8.956.54 2.78.26 5.103-1.17 6.734a5.584 5.584 0 0 1-1.601 1.235"></path><path fill="#012169" d="M32.392 35.14c-.226.067-.459.127-.699.18-.24.053-.488.1-.742.14-.89.145-1.862.213-2.906.213h-8.807a1.404 1.404 0 0 1-1.389-1.188l-1.872-11.87-.054-.345a1.602 1.602 0 0 0 1.582 1.357h3.297c6.475 0 11.545 2.63 13.026 10.238.044.225.081.443.115.658a7.998 7.998 0 0 1-1.218.514c-.109.036-.22.07-.333.104"></path></g></g></svg>`
    } else if (method == 'stripe') {
      label.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width='51' height='40' viewBox="0 0 24 24" id="stripe"><path fill="#646FDE" d="M11.319 9.242h1.673v5.805h-1.673zM4.226 13.355c0-2.005-2.547-1.644-2.547-2.403l.001.002c0-.262.218-.364.567-.368a3.7 3.7 0 0 1 1.658.432V9.434a4.4 4.4 0 0 0-1.654-.307C.9 9.127 0 9.839 0 11.029c0 1.864 2.532 1.561 2.532 2.365 0 .31-.266.413-.638.413-.551 0-1.264-.231-1.823-.538v1.516a4.591 4.591 0 0 0 1.819.382c1.384-.001 2.336-.6 2.336-1.812zM11.314 8.732l1.673-.36V7l-1.673.36zM16.468 9.129a1.86 1.86 0 0 0-1.305.527l-.086-.417H13.61V17l1.665-.357.004-1.902c.24.178.596.425 1.178.425 1.193 0 2.28-.879 2.28-3.016.004-1.956-1.098-3.021-2.269-3.021zm-.397 4.641c-.391.001-.622-.143-.784-.318l-.011-2.501c.173-.193.413-.334.795-.334.607 0 1.027.69 1.027 1.569.005.906-.408 1.584-1.027 1.584zm5.521-4.641c-1.583 0-2.547 1.36-2.547 3.074 0 2.027 1.136 2.964 2.757 2.964.795 0 1.391-.182 1.845-.436v-1.266c-.454.231-.975.371-1.635.371-.649 0-1.219-.231-1.294-1.019h3.259c.007-.087.022-.44.022-.602H24c0-1.725-.825-3.086-2.408-3.086zm-.889 2.448c0-.758.462-1.076.878-1.076.409 0 .844.319.844 1.076h-1.722zm-13.251-.902V9.242H6.188l-.004-1.459-1.625.349-.007 5.396c0 .997.743 1.641 1.729 1.641.548 0 .949-.103 1.171-.224v-1.281c-.214.087-1.264.398-1.264-.595v-2.395h1.264zm3.465.114V9.243c-.225-.08-1.001-.227-1.391.496l-.102-.496h-1.44v5.805h1.662v-3.907c.394-.523 1.058-.42 1.271-.352z"></path></svg>`
    } else {
      label.style.fontWeight = '500';
      label.textContent = langData[34] ? langData[34] : `CASH ON COUNTER`;
    }
    label.htmlFor = option.id;
    paydiv.appendChild(option);
    paydiv.appendChild(label);
    payMethods.appendChild(paydiv);
  });
}

async function appointmentForm(data, campaignID, campaignType, parentelementid, enablertl) {

  const parentelement = document.getElementById(parentelementid);

  let langData = window[parentelementid + "_lang"];

  window[parentelementid + "_is_verify"] = false;

  parentelement.innerHTML = `<div class='widget_form_box'>
  <h2>${data.headline}</h2>
  <h5>${data.subHeadline}</h5>
  <div>
  <div class='widget_event_detail_wrapper'>
  <h4>${langData[48] ? langData[48] : `Appointment Details`}</h4>
  <div>
      <div class='widget_event_content_wrap'>
          <span><svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="14" height="14"><path d="M12,6a4,4,0,1,0,4,4A4,4,0,0,0,12,6Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,12,12Z" /><path d="M12,24a5.271,5.271,0,0,1-4.311-2.2c-3.811-5.257-5.744-9.209-5.744-11.747a10.055,10.055,0,0,1,20.11,0c0,2.538-1.933,6.49-5.744,11.747A5.271,5.271,0,0,1,12,24ZM12,2.181a7.883,7.883,0,0,0-7.874,7.874c0,2.01,1.893,5.727,5.329,10.466a3.145,3.145,0,0,0,5.09,0c3.436-4.739,5.329-8.456,5.329-10.466A7.883,7.883,0,0,0,12,2.181Z" /></svg>
          </span>
          <div>
          <p>${langData[3] ? langData[3] : `Venue:`}</p>
              <h4 id='appintVenue'></h4>
          </div>
      </div>
  </div>
  <div class='widget_event_content_wrap' style="display: none" id="phone_cont">
  <span>
  <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 32 32" viewBox="0 0 32 32" id="call"><g><path d="M13.323,18.677c-1.462-1.462-2.582-3.252-3.343-5.385c-0.183-0.518-0.03-1.097,0.358-1.485l2.125-2.125
  c1.18-1.18,1.18-3.1,0-4.28L9.941,2.882c-1.18-1.18-3.092-1.173-4.273,0.008L4.625,3.933C2.721,5.837,1.708,8.51,2.074,11.175
  c0.602,4.532,2.742,8.652,6.413,12.338c3.686,3.671,7.806,5.811,12.338,6.413c2.666,0.366,5.339-0.647,7.243-2.551l1.043-1.043
  c1.18-1.18,1.188-3.092,0.008-4.273l-2.521-2.521c-1.18-1.18-3.1-1.18-4.28,0l-2.125,2.125c-0.388,0.388-0.967,0.541-1.485,0.358
  C16.575,21.259,14.785,20.14,13.323,18.677z"></path><path d="M26.619,4.593h-6.746c-1.105,0-2,0.895-2,2v4.361c0,1.105,0.895,2,2,2h1.783l1.191,1.206c0.212,0.215,0.559,0.215,0.771,0
  l1.191-1.206h1.809c1.105,0,2-0.895,2-2V6.593C28.619,5.489,27.724,4.593,26.619,4.593z M20.921,9.378
  c-0.334,0-0.604-0.271-0.604-0.604s0.27-0.604,0.604-0.604c0.334,0,0.604,0.271,0.604,0.604S21.255,9.378,20.921,9.378z
  M23.246,9.378c-0.334,0-0.604-0.271-0.604-0.604s0.271-0.604,0.604-0.604s0.604,0.271,0.604,0.604S23.58,9.378,23.246,9.378z
  M25.571,9.378c-0.334,0-0.604-0.271-0.604-0.604s0.271-0.604,0.604-0.604s0.604,0.271,0.604,0.604S25.905,9.378,25.571,9.378z"></path></g></svg>
  </span>
  <div>
  <p>${langData[9] ? langData[9] : `Contact:`}</p>
      <h4 id='contact_detail'></h4>
  </div>
</div>
  </div>
</div>
  <div id = 'widget_datetime'>
      <form id="bookingForm" style="display: block" autocomplete="off">
          <div class="widget_inp_list_wrap">
              <div class='widget_ipt_wrap'>
                  <label>${langData[49] ? langData[49] : `Appointment Date`}</label>
                  <input type="text" id="selectedBookingDate" data-language='en' placeholder=${langData[23] ? langData[23] : 'Date'}>
                  <span class='error' id='dateerror'></span>
              </div>
              <div class='widget_ipt_wrap' style="display: none" id='staffinpt'>
                  <label id="staffLabel">${langData[50] ? langData[50] : `Select A Staff Member`}</label>
                  <select name="staff" id="staff">
                  </select>
                  <span class='error' id='stafferror'></span>
              </div>
          </div>
      </form>
      <form style="display: none" id="timeSlots">
          <div class='widget_ipt_wrap'>
          <label>${langData[1] ? langData[1] : `Time Slot`}</label>
          </div>
          <div class="widget_radio_btn_wrapper" id="timeSlotsContainer">
          </div>
          <span class='error' id='timesloterror'></span>
          <div class="widget_btn_wrap widget_text_left">
              <button type="submit" class="widget_btn_css"> ${langData[4] ? langData[4] : `Continue`}</button>
          </div>
      </form>
      <div id="bookedmessage"></div>
  </div>
      <form style="display: none" id="userDetails" novalidate>
          <p id="p1" class="prev_detail"></p>
          <div id="nameFieldsElement"> </div>
          <div id="emailFieldsElement"> </div>
          <div id="InputFields">
          </div>
          <div class="widget_btn_wrap widget_text_left">
              <button type="button" class="widget_btn_css_back" onclick='backButtonClick("userDetails","widget_datetime","${parentelementid}")'>${langData[8] ? langData[8] : `Back`}</button>
              <button type="submit" class="widget_btn_css"> ${langData[4] ? langData[4] : `Continue`}</button>
          </div>
      </form>
      <form style="display: none" id="finalSubmit">
          <p id="p2"></p>
          <div id="payMethods">
          </div>
          <span class='error' id='payoptionerror'></span>
          <div class="widget_btn_wrap widget_text_left">
              <button type="button" class="widget_btn_css_back" onclick='backButtonClick("finalSubmit","userDetails","${parentelementid}")'>${langData[8] ? langData[8] : `Back`}</button>
              <button type="submit" class="widget_btn_css">${langData[11] ? langData[11] : `Pay`}</button>
          </div>
      </form>
      <div id='widget_payment_checkout' style="display: none">
      <div id="checkout">
        <!-- stripe checkout form -->
      </div>
      <div id="paypal_loader"></div>
      <div id="paypal-button-container"></div>
      <div class="widget_btn_box_Wrapper">
        <button type="button" class="widget_btn_css_back"
          onclick='backButtonClick("widget_payment_checkout","finalSubmit","${parentelementid}")'>${langData[8] ? langData[8] : `Back`}</button>
      </div>
    </div>
      <div id="thanku_loader"> </div>
      <div class='widget_thanku_box'>
        <p id='thankyoumsg'></p>
    </div>
    <div id="orderdetails" style="display: none" class="order_detail">
    <div class='detail_wrap'>
    <div class='detail_tag' ><div>${langData[49] ? langData[49] : `Appointment Date :`}</div><span id="appoint_date"></span></div>
    <div class='detail_tag'><div>${langData[46] ? langData[46] : `Selected Time :`}</div><span id="selected_date"></span></div>
    <div class='detail_tag' id="staff_div" style="display: none"><div>${langData[47] ? langData[47] : `Selected Staff :`}</div><span id="selected_staff"></span></div>
        <div class='detail_tag' id="bill"><div>${langData[10] ? langData[10] : `Bill To :`}</div><span id="bill_to"></span></div>
        <div class='detail_tag'  id="pay_m"><div>${langData[31] ? langData[31] : `Payment Method :`}</div><span id="pay_method"></span></div>
        <div class='detail_tag' id="trans"><div>${langData[32] ? langData[32] : `Transaction Id :`}</div><span id="transaction"></span></div>
    </div>
    <div class='detail_tag'  id="tot"><div>${langData[17] ? langData[17] : `Total Amount :`}</div><span id="tot_amount"></span></div>
    </div>
  </div>
  </div> 
  `;

  if (enablertl) {
    parentelement.classList.add('rtl');
  }

  const result = await fetch(HOST_URL + '/api/externalWidgetApi', {
    method: 'PUT',
    body: JSON.stringify({disabledates : true, campaign_id: campaignID, campaign_type: campaignType, staff: data.staff, campaignDetail : data })
  });
  let response = await result.json();
  let disabledata = response.data;  

  let dateAndTypeselect = async () => {
    const date = datepickerInput.value;
    const selectedDate = new Date(date);
    const errorspan = parentelement.querySelector('#dateerror');
    errorspan.textContent = ''
    const stafferrorspan = parentelement.querySelector('#stafferror');
    stafferrorspan.textContent = ''
    if (!date || (!staffInput.value && (data.staff).length > 0)) {
      let timeSlots = parentelement.querySelector('#timeSlots');
      timeSlots.style.display = 'none';
      if (!date) {
        const errorspan = parentelement.querySelector('#dateerror');
        errorspan.textContent = langData[41] ? langData[41] : 'Please select a date.';
      }
      if (!staffInput.value && (data.staff).length > 0) {
        const stafferrorspan = parentelement.querySelector('#stafferror');
        stafferrorspan.textContent = langData[33] ? langData[33] : 'Please select a option.'
      }
    }
    else {
      // Track of booked Slots 
      const result = await fetch(HOST_URL + '/api/externalWidgetApi', {
        method: 'PUT',
        body: JSON.stringify({ date: selectedDate, campaign_id: campaignID, campaign_type: campaignType, staff: staffInput.value })
      });
      let response = await result.json();
      if (response) {
        const timeSlotsContainer = parentelement.querySelector('#timeSlotsContainer');
        while (timeSlotsContainer.firstChild) {
          timeSlotsContainer.removeChild(timeSlotsContainer.firstChild);
        }
        let timeSlots = parentelement.querySelector('#timeSlots');
        timeSlots.style.display = 'block';
        timeSlotCreation(parentelementid, parentelement, selectedDate, data, timeSlotsContainer, response.data);
      }
    }
  }

  const appint_Venue = parentelement.querySelector('#appintVenue');
  appint_Venue.textContent = data.campaignID.address;
  if (data.campaignID?.phone) {
    const phone_cont = parentelement.querySelector('#phone_cont');
    phone_cont.style.display = 'flex';
    const contact_detail = parentelement.querySelector('#contact_detail');
    contact_detail.textContent = data.campaignID.phone;
  }
  let datepickerInput = parentelement.querySelector('#selectedBookingDate');
  // const datepickerInput = parentelement.querySelector('selectedBookingDate');
  const staffInput = parentelement.querySelector('#staff');
  disableDates(data.holidays, data.businessDays, datepickerInput, dateAndTypeselect,disabledata);
  const staffSelect = parentelement.querySelector('#staff');
  const staffSelectlabel = parentelement.querySelector('#staffLabel');
  const staffinpt = parentelement.querySelector('#staffinpt');
  const defaultOption = document.createElement('option');
  defaultOption.textContent = langData[33] ? langData[33] : 'select an option';
  defaultOption.value = '';
  staffSelect.appendChild(defaultOption);
  // Populate the select dropdown with staff members
  if ((data.staff).length > 0) {
    staffinpt.style.display = 'block'
    data.staff.forEach((staffMember) => {
      const option = document.createElement('option');
      option.value = staffMember.id;
      option.textContent = staffMember.name + ` (${staffMember.service})`;
      staffSelect.appendChild(option);
    });
  }

  staffSelect.addEventListener('change', function () {
    dateAndTypeselect();
  });

  let bookingForm = parentelement.querySelector('#bookingForm');

  let timeSlots = parentelement.querySelector('#timeSlots');
  var ifields = [];

  timeSlots.addEventListener('submit', async (e) => {
    e.preventDefault();
    const selectedRadio = parentelement.querySelector('input[name="timeSlot"]:checked');
    const timesloterror = parentelement.querySelector('#timesloterror');
    timesloterror.textContent = ''
    if (!selectedRadio) {
      timesloterror.textContent = langData[33] ? langData[33] : 'Please Select a option.'
    }
    else {
      let widget_datetime = parentelement.querySelector('#widget_datetime')
      widget_datetime.style.display = 'none';
      ifields = [{ label: 'Name', name: 'Name' }, { label: 'Email', name: 'visitorEmail' }];
      const InputFieldsElement = parentelement.querySelector('#InputFields');
      while (InputFieldsElement.firstChild) {
        InputFieldsElement.removeChild(InputFieldsElement.firstChild);
      }
      const nameFieldsElement = parentelement.querySelector('#nameFieldsElement')
      const emailFieldsElement = parentelement.querySelector('#emailFieldsElement')
      const isexsistEmail = parentelement.querySelector('#visitorEmail');
      if (!window[parentelementid + "_is_verify"] && !isexsistEmail) emailfieldcreation(nameFieldsElement, emailFieldsElement, campaignID, parentelement, parentelementid);
      inputFieldsCreation(parentelementid, data, ifields, InputFieldsElement);
      let selectedInfoPara = parentelement.querySelector('#p1');
      let selectedTime = (new Date(selectedRadio.value)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      if ((data.staff).length > 0) {
        let selectedStaffMember = data.staff.find(staffMember => staffMember.id === (staffInput.value));
        let emp = `${selectedStaffMember.name}  (${selectedStaffMember.designation})`;
        let empservice = selectedStaffMember.service;

        if (langData[51] && langData[53]) {
          selectedInfoPara.textContent = `${langData[51].replace(/\{employeeService\}/g, empservice).replace(/\{employee\}/g, emp).replace(/\{date\}/g, customizeDateFormate(datepickerInput.value)).replace(/\{selectedTime\}/g, selectedTime)
            + ` ` + langData[53]}`
        }
        else {
          selectedInfoPara.textContent = `Your ${empservice} appointment with ${emp} is scheduled for  ${customizeDateFormate(datepickerInput.value)} at ${selectedTime}.
               Please provide your details in the form below to proceed.`
        }

      }
      else {
        if (langData[52] && langData[53]) {
          selectedInfoPara.textContent =
            `${langData[52].replace(/\{selectedDate\}/g, customizeDateFormate(datepickerInput.value)).replace(/\{selectedTime\}/g, selectedTime)
            + ` ` + langData[53]}`
        }
        else {
          selectedInfoPara.textContent = `Your appointment  is scheduled for ${customizeDateFormate(datepickerInput.value)} at ${selectedTime}. Please provide your details in the form below to proceed.`
        }
      }
      let userDetails = parentelement.querySelector('#userDetails');
      userDetails.style.display = 'block';
    }
  });
  async function handlefinalsubmit(parentelement) {
    const selectedPaymentType = parentelement.querySelector('input[name="paymentType"]:checked');
    const selectedRadio = parentelement.querySelector('input[name="timeSlot"]:checked');
    const selectedTime = selectedRadio.value;
    let slotTime = new Date(selectedTime).toLocaleTimeString();
    var userInfo = {};
    ifields.forEach((field) => {
      let input = parentelement.querySelector(`#${field.name}`);
      let inputvalue;
      // for checkbox and radio button 
      if (!input) {
        input = parentelement.querySelectorAll(`input[name="${field.name}"]:checked`);
        inputvalue = Array.from(input).map(ele => ele.value);
      }
      else {
        inputvalue = input.value;
      }
      userInfo[field.label] = inputvalue;
    });
    let bookingDetails = {
      appointmentDate: datepickerInput.value,
      slotTime: slotTime,
      userInfo: userInfo,
    }
    if ((data.staff).length > 0 && staffInput.value) {
      bookingDetails.staff = staffInput.value;
    }
    if (data.registrationType == 'paid') {
      bookingDetails.paymentMode = selectedPaymentType.value;
      const isexsistEmail = parentelement.querySelector('#visitorEmail');
      await handlePayment(parentelementid, selectedPaymentType.value, data, campaignID, bookingDetails, total = data.fee, email = isexsistEmail.value);
    }
    else {
      tableSkeletonLoader(parentelement);
      bookingDetails.registrationType = 'free'
      let finaldata = {
        campaignID,
        campaignType: data.campaignID.type,
        visitorId: window[parentelementid + "_visitorId"],
        bookingDetails
      }
      let res = await saveData(parentelementid, finaldata);
      if (res.status == 0) {
        const thankyou = parentelement.querySelector('#thankyoumsg');
        thankyou.style.display = 'block';
        thankyou.textContent = langData[57] ? langData[57] : res.message;
        const thankuLoader = parentelement.querySelector('#thanku_loader');
        thankuLoader.style.display = 'none';
      }
      else {
        {
          const thankuLoader = parentelement.querySelector('#thanku_loader');
          thankuLoader.style.display = 'none';
          const thankyou = parentelement.querySelector('#thankyoumsg');
          thankyou.style.display = 'block';
          thankyou.textContent = data.thankyouMessage;
          const orderdetails = parentelement.querySelector('#orderdetails')
          orderdetails.style.display = 'block';
          const AppointDate = parentelement.querySelector('#appoint_date');
          AppointDate.textContent = customizeDateFormate(finaldata.bookingDetails?.appointmentDate);
          const selected_date = parentelement.querySelector('#selected_date');
          selected_date.textContent = (new Date(`2000-01-10  ${finaldata.bookingDetails?.slotTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          if (finaldata.bookingDetails?.staff) {
            const staff_div = parentelement.querySelector('#staff_div');
            staff_div.style.display = 'flex';
            let staff = data.staff.find(staff => staff.id === finaldata.bookingDetails?.staff);
            const selected_staff = parentelement.querySelector('#selected_staff');
            selected_staff.textContent = staff.name;
          }
          const bill = parentelement.querySelector('#bill');
          bill.style.display = 'none';
          const trans = parentelement.querySelector('#trans');
          trans.style.display = 'none';
          const pay_m = parentelement.querySelector('#pay_m');
          pay_m.style.display = 'none';
          const tot = parentelement.querySelector('#tot');
          tot.style.display = 'none';
        }
      }
    }
  }
  let userDetails = parentelement.querySelector('#userDetails');
  userDetails.addEventListener('submit', async (e) => {
    e.preventDefault();
    const isValidForm = validateForm(ifields, parentelement, parentelementid);
    if ((window[parentelementid + "_is_verify"] == false)) {
      let errorElement = parentelement.querySelector(`#visitorEmail-error`);
      errorElement.textContent = langData[39] ? langData[39] : `Please verify your email.`;
    }
    if (isValidForm && window[parentelementid + "_is_verify"]) {
      userDetails.style.display = 'none';
      if (data.registrationType == 'paid') {
        const payMethods = parentelement.querySelector('#payMethods');
        while (payMethods.firstChild) {
          payMethods.removeChild(payMethods.firstChild);
        }
        paymentOptionCreation(data, payMethods, parentelementid);
        const paymentInfo = parentelement.querySelector('#p2');
        const selectedRadio = parentelement.querySelector('input[name="timeSlot"]:checked');
        let selectedTime = (new Date(selectedRadio.value)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        if ((data.staff).length > 0) {
          let selectedStaffMember = data.staff.find(staffMember => staffMember.id === (staffInput.value));
          let emp = `${selectedStaffMember.name}  (${selectedStaffMember.designation})`;
          let empservice = selectedStaffMember.service;

          if (langData[54] && langData[51]) {
            paymentInfo.textContent =
              `${langData[51].replace(/\{employeeService\}/g, empservice).replace(/\{employee\}/g, emp).replace(/\{date\}/g, customizeDateFormate(datepickerInput.value)).replace(/\{selectedTime\}/g, selectedTime)
              + ` ` + langData[54].replace(/\{price\}/g, `${widgetCurrency[data.currency]} ${data.fee}`)}`
          }
          else {
            `Your ${empservice} appointment with ${emp} is scheduled for  ${customizeDateFormate(datepickerInput.value)} at ${selectedTime}.
                 Price for the service is ${widgetCurrency[data.currency]} ${data.fee}. How you would like to pay:`
          }
        }
        else {
          if (langData[52] && langData[54]) {
            paymentInfo.textContent =
              `${langData[52].replace(/\{date\}/g, customizeDateFormate(datepickerInput.value)).replace(/\{selectedTime\}/g, selectedTime)
              + ` ` + langData[54].replace(/\{price\}/g, `${widgetCurrency[data.currency]} ${data.fee}`)}`
          }
          else {
            `Your appointment  is scheduled for ${customizeDateFormate(datepickerInput.value)} at ${selectedTime}.
               Price for the service is ${widgetCurrency[data.currency]} ${data.fee}. How you would like to pay:`
          }
        }
        finalSubmit.style.display = 'block';
      }
      else {
        handlefinalsubmit(parentelement);
      }
    }
  })
  let finalSubmit = parentelement.querySelector('#finalSubmit');
  finalSubmit.addEventListener('submit', async (e) => {
    e.preventDefault();
    const selectedPaymentType = parentelement.querySelector('input[name="paymentType"]:checked');
    const payoptionerror = parentelement.querySelector('#payoptionerror');
    payoptionerror.textContent = ''
    if (!selectedPaymentType && data.registrationType == 'paid') {
      payoptionerror.textContent = langData[33] ? langData[33] : 'Please Select a option'
    }
    else {
      handlefinalsubmit(parentelement);
      finalSubmit.style.display = 'none';
    }
  })
}

function eventForm(data, campaignID, campaignType, parentelementid, enablertl) {

  let langData = window[parentelementid + "_lang"];

  const parentelement = document.getElementById(parentelementid);

  window[parentelementid + "_is_verify"] = false;
  parentelement.innerHTML = `
  <div class='widget_form_box' >
                    <div class='widget_heading_wrapper'>
                        <div class='widget_calender_design'>
                            <div id="eventMonths"></div>
                            <div id="eventDates"></div>
                        </div>
                        <div>
                            <h2>${data?.headline}</h2>
                            <h5>${data?.subHeadline}</h5>
                        </div>
                    </div>
                    <div class='widget_event_detail_wrapper'>
                                <h4>${langData[58] ? langData[58] : `Event Details`}</h4>
                                <div>
                                    <div class='widget_event_content_wrap'>
                                        <span><svg width="12" height="14" viewBox="0 0 15 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 0.00133413C6.864 -0.0135446 6.23138 0.0961553 5.63935 0.323981C5.04732 0.551807 4.50784 0.893158 4.05264 1.32795C3.59745 1.76275 3.23573 2.28221 2.98876 2.85578C2.7418 3.42935 2.61457 4.04544 2.61457 4.66782C2.61457 5.2902 2.7418 5.9063 2.98876 6.47987C3.23573 7.05343 3.59745 7.5729 4.05264 8.00769C4.50784 8.44249 5.04732 8.78384 5.63935 9.01166C6.23138 9.23949 6.864 9.34919 7.5 9.33431C8.136 9.34919 8.76863 9.23949 9.36065 9.01166C9.95268 8.78384 10.4922 8.44249 10.9474 8.00769C11.4026 7.5729 11.7643 7.05343 12.0112 6.47987C12.2582 5.9063 12.3854 5.2902 12.3854 4.66782C12.3854 4.04544 12.2582 3.42935 12.0112 2.85578C11.7643 2.28221 11.4026 1.76275 10.9474 1.32795C10.4922 0.893158 9.95268 0.551807 9.36065 0.323981C8.76863 0.0961553 8.136 -0.0135446 7.5 0.00133413ZM4.77273 11.9997C3.50692 11.9997 2.29296 12.4917 1.3979 13.3673C0.502839 14.2429 0 15.4306 0 16.6689V20H15V16.6689C15 15.4306 14.4972 14.2429 13.6021 13.3673C12.707 12.4917 11.4931 11.9997 10.2273 11.9997H4.77273Z" fill="#797979"></path></svg></span>
                                        <div>
                                            <p>${langData[59] ? langData[59] : `Organised By:`}</p>
                                            <h4 id='eventorganizer'></h4>
                                        </div>
                                    </div>
                                    <div class='widget_event_content_wrap'>
                                        <span><svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="14" height="14"><path d="M12,6a4,4,0,1,0,4,4A4,4,0,0,0,12,6Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,12,12Z" /><path d="M12,24a5.271,5.271,0,0,1-4.311-2.2c-3.811-5.257-5.744-9.209-5.744-11.747a10.055,10.055,0,0,1,20.11,0c0,2.538-1.933,6.49-5.744,11.747A5.271,5.271,0,0,1,12,24ZM12,2.181a7.883,7.883,0,0,0-7.874,7.874c0,2.01,1.893,5.727,5.329,10.466a3.145,3.145,0,0,0,5.09,0c3.436-4.739,5.329-8.456,5.329-10.466A7.883,7.883,0,0,0,12,2.181Z" /></svg>
                                        </span>
                                        <div>
                                        <p>${langData[3] ? langData[3] : `Venue:`}</p>
                                            <h4 id='eventVenue'></h4>
                                        </div>
                                    </div>
                                </div>
                                <div class='widget_event_content_wrap'>
                                    <span> <svg width="14" height="14" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10.5413 11.75H12.4163V13.625H10.5413V11.75ZM3.97876 11.75H7.72876V13.625H3.97876V11.75Z" />
                                        <path d="M0.19751 14.5625C0.19751 15.3379 0.828322 16 1.60376 16H14.7913C15.5667 16 16.1975 15.3379 16.1975 14.5625V4.6875H0.19751V14.5625ZM13.3538 14.0938C13.3538 14.3528 13.1441 14.5625 12.885 14.5625H10.0725C9.81342 14.5625 9.60376 14.3528 9.60376 14.0938V11.2812C9.60376 11.0222 9.81342 10.8125 10.0725 10.8125H12.885C13.1441 10.8125 13.3538 11.0222 13.3538 11.2812V14.0938ZM3.04126 6.59375C3.04126 6.33466 3.25092 6.125 3.51001 6.125H12.885C13.1441 6.125 13.3538 6.33466 13.3538 6.59375V9.40625C13.3538 9.66534 13.1441 9.875 12.885 9.875H3.51001C3.25092 9.875 3.04126 9.66534 3.04126 9.40625V6.59375ZM3.04126 11.2812C3.04126 11.0222 3.25092 10.8125 3.51001 10.8125H8.19751C8.4566 10.8125 8.66626 11.0222 8.66626 11.2812V14.0938C8.66626 14.3528 8.4566 14.5625 8.19751 14.5625H3.51001C3.25092 14.5625 3.04126 14.3528 3.04126 14.0938V11.2812Z" />
                                        <path d="M3.97876 7.0625H12.4163V8.9375H3.97876V7.0625ZM14.7913 0H1.60376C0.828322 0 0.19751 0.630813 0.19751 1.40625V3.75H16.1975V1.40625C16.1975 0.630813 15.5667 0 14.7913 0ZM3.51001 2.34375C3.25113 2.34375 3.04126 2.13387 3.04126 1.875C3.04126 1.61606 3.25113 1.40625 3.51001 1.40625C3.76888 1.40625 3.97876 1.61606 3.97876 1.875C3.97876 2.13387 3.76888 2.34375 3.51001 2.34375ZM5.38501 2.34375C5.12613 2.34375 4.91626 2.13387 4.91626 1.875C4.91626 1.61606 5.12613 1.40625 5.38501 1.40625C5.64388 1.40625 5.85376 1.61606 5.85376 1.875C5.85376 2.13387 5.64388 2.34375 5.38501 2.34375ZM7.26001 2.34375C7.00113 2.34375 6.79126 2.13387 6.79126 1.875C6.79126 1.61606 7.00113 1.40625 7.26001 1.40625C7.51888 1.40625 7.72876 1.61606 7.72876 1.875C7.72876 2.13387 7.51888 2.34375 7.26001 2.34375Z" />
                                    </svg></span>
                                    <div style="margin-bottom:10px;">
                                    <p>${langData[60] ? langData[60] : `Date and Time`}</p>
                                        <div id='eventDateTime'>
                                        </div>
                                    </div>
                                </div>
                                <div class='widget_event_content_wrap'style="display: none" id="phone_cont">
                                <span>
                                <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 32 32" viewBox="0 0 32 32" id="call"><g><path d="M13.323,18.677c-1.462-1.462-2.582-3.252-3.343-5.385c-0.183-0.518-0.03-1.097,0.358-1.485l2.125-2.125
                                c1.18-1.18,1.18-3.1,0-4.28L9.941,2.882c-1.18-1.18-3.092-1.173-4.273,0.008L4.625,3.933C2.721,5.837,1.708,8.51,2.074,11.175
                                c0.602,4.532,2.742,8.652,6.413,12.338c3.686,3.671,7.806,5.811,12.338,6.413c2.666,0.366,5.339-0.647,7.243-2.551l1.043-1.043
                                c1.18-1.18,1.188-3.092,0.008-4.273l-2.521-2.521c-1.18-1.18-3.1-1.18-4.28,0l-2.125,2.125c-0.388,0.388-0.967,0.541-1.485,0.358
                                C16.575,21.259,14.785,20.14,13.323,18.677z"></path><path d="M26.619,4.593h-6.746c-1.105,0-2,0.895-2,2v4.361c0,1.105,0.895,2,2,2h1.783l1.191,1.206c0.212,0.215,0.559,0.215,0.771,0
                                l1.191-1.206h1.809c1.105,0,2-0.895,2-2V6.593C28.619,5.489,27.724,4.593,26.619,4.593z M20.921,9.378
                                c-0.334,0-0.604-0.271-0.604-0.604s0.27-0.604,0.604-0.604c0.334,0,0.604,0.271,0.604,0.604S21.255,9.378,20.921,9.378z
                                M23.246,9.378c-0.334,0-0.604-0.271-0.604-0.604s0.271-0.604,0.604-0.604s0.604,0.271,0.604,0.604S23.58,9.378,23.246,9.378z
                                M25.571,9.378c-0.334,0-0.604-0.271-0.604-0.604s0.271-0.604,0.604-0.604s0.604,0.271,0.604,0.604S25.905,9.378,25.571,9.378z"></path></g></svg>
                                </span>
                                <div>
                                <p>${langData[9] ? langData[9] : `Contact:`}</p>
                                    <h4 id='contact_detail'></h4>
                                </div>
                            </div>
                            </div>
                            <div class='widget_thanku_box' style="display: none" id='registrationMsg'>
                            </div>
                    <form id='ticketSelect' style="display: none">
                            <div class='widget_ticket_list_wrap'>
                                    <h4>${langData[61] ? langData[61] : `Select Tickets`}</h4>
                                    <div id='ticketOptions'></div>
                                </div>
                                <div style="text-align:end;margin-bottom:20px;">
                                  <div class='widget_text_left' style="margin-bottom:0px;">
                                  ${langData[16] ? langData[16] : `Total`} - <span id='campaignCurrency'></span><span id='totalAmount'>0</span>
                                  </div>
                                  <span class='error'  id='ticketerror'></span>
                                  </div>
                                <div class="widget_btn_box_Wrapper">
                                <button type="submit" class="widget_btn_css">${langData[4] ? langData[4] : `Continue`}</button>
                            </div>
                            </form>
                            <div id='soldOutbtn' style="display: none">
                            <div id='soldOutMsg'></div>
                            </div>
                        <form style="display: none" id='userDetails' novalidate>
                            <p id="userDetails_inp_det" class="prev_detail">Please provide your details in the form below to proceed...</p>
                            <div id="nameFieldsElement"> </div>
                            <div id="emailFieldsElement"> </div>
                            <div id="InputFields">
                            </div>
                            <div class="widget_btn_box_Wrapper">
                                <button type="button" class="widget_btn_css_back" onclick='backButtonClick("userDetails","ticketSelect","${parentelementid}")'>${langData[8] ? langData[8] : `Back`}</button>
                                <button type="submit" class="widget_btn_css">${langData[4] ? langData[4] : `Continue`}</button>
                            </div>
                        </form>
                        <form style="display: none" id="finalSubmit">
                        <p id="p2" class="prev_detail"></p>
                        <div id="payMethods">
                        </div>
                        <span class='error' id='payoptionerror'></span>
                            <div class="widget_btn_box_Wrapper">
                                <button type="button" class="widget_btn_css_back"  onclick='backButtonClick("finalSubmit","userDetails","${parentelementid}")'>${langData[8] ? langData[8] : `Back`}</button>
                                <button type="submit" class="widget_btn_css">${langData[11] ? langData[11] : `Pay`}</button>
                            </div>
                        </form>
                        <div id='widget_payment_checkout' style="display: none">
    <div id="checkout">
      <!-- stripe checkout form -->
    </div>
    <div id="paypal_loader"></div>
    <div id="paypal-button-container"></div>
    <div class="widget_btn_box_Wrapper">
      <button type="button" class="widget_btn_css_back"
        onclick='backButtonClick("widget_payment_checkout","finalSubmit","${parentelementid}")'>${langData[8] ? langData[8] : `Back`}</button>
    </div>
  </div>
                        <div id="thanku_loader"> </div>
                        <div class='widget_thanku_box'>
                            <p id='thankyoumsg'></p>
                        </div>
                        <div id="orderdetails" style="display: none" class="order_detail">
                        <div class='detail_wrap'>
                            <div class='detail_tag' id="bill"><div>${langData[10] ? langData[10] : `Bill To :`}</div><span id="bill_to"></span></div>
                            <div class='detail_tag' id="pay_remove"><div>${langData[31] ? langData[31] : `Payment Method :`} </div><span id="pay_method"></span></div>
                            <div class='detail_tag' id="trans"><div>${langData[32] ? langData[32] : `Transaction Id :`}</div><span id="transaction"></span></div>
                        </div>
                        <div class='table_conatiner'>
                            <table class='table' id="detail_table">
                                <thead>
                                <th>${langData[19] ? langData[19] : `Selected`}</th>
                                <th>${langData[20] ? langData[20] : `Quantity`}</th>
                                <th>${langData[21] ? langData[21] : `Price`}</th>
                                <th>${langData[22] ? langData[22] : `Amount`}</th>
                                </thead>
                            </table>
                        </div>
                        <div class='detail_tag'><div>${langData[17] ? langData[17] : `Total Amount :`}</div><span id="tot_amount"></span></div>
                        </div>
                    </div>
                    </div>  `;

  if (enablertl) {
    parentelement.classList.add('rtl');
  }

  const emonths = parentelement.querySelector('#eventMonths');
  const edates = parentelement.querySelector('#eventDates');
  if (new Date(data.eventStartDate).getMonth() < new Date(data.eventEndDate).getMonth()) {
    let st = new Date(data.eventStartDate).toLocaleString('default', { month: 'short' });
    let ed = new Date(data.eventEndDate).toLocaleString('default', { month: 'short' });
    emonths.textContent = st + `-` + ed;
    const startDay = new Date(data.eventStartDate).getDate();
    const endDay = new Date(data.eventEndDate).getDate();
    edates.textContent = startDay + `-` + endDay;
  }
  else {
    let st = new Date(data.eventStartDate).toLocaleString('default', { month: 'short' });
    let ed = new Date(data.eventEndDate).toLocaleString('default', { month: 'short' });
    const startDay = new Date(data.eventStartDate).getDate();
    const endDay = new Date(data.eventEndDate).getDate();
    if (st != ed) {
      emonths.textContent = st + `-` + ed;
      edates.textContent = startDay + `-` + endDay;
    }
    else {
      emonths.textContent = st;
      if (startDay < endDay) {
        edates.textContent = startDay + `-` + endDay;
      }
      else {
        edates.textContent = startDay;
      }
    }
  }
  //Event Details
  const eventorganizer = parentelement.querySelector('#eventorganizer');
  eventorganizer.textContent = data.campaignID.business;
  const eventVenue = parentelement.querySelector('#eventVenue');
  eventVenue.textContent = data.campaignID.address;
  const dateOptions = { weekday: 'short', day: 'numeric', month: 'short' };
  const timeOptions = { hour: '2-digit', minute: '2-digit' };
  const eventDateTime = parentelement.querySelector('#eventDateTime');
  (data.eventDays).forEach((event) => {
    const date = new Date(event.date);
    const formattedDate = date.toLocaleDateString('en-US', dateOptions);
    const formattedTime = new Date(event.startTime).toLocaleTimeString('en-US', timeOptions);
    const h4 = document.createElement('h4');
    h4.style.padding = '0px';
    h4.textContent = `${formattedDate}, ${formattedTime}`;
    eventDateTime.appendChild(h4);
  });
  if (data.campaignID?.phone) {
    const phoneDiv = parentelement.querySelector('#phone_cont');
    phoneDiv.style.display = 'flex';
    const contact_detail = parentelement.querySelector('#contact_detail');
    contact_detail.textContent = data.campaignID?.phone;
  }
  // Valid registartion Date or not 
  if (new Date(data.registrationDate.startDate) >= new Date()) {
    let msgDiv = parentelement.querySelector('#registrationMsg');
    msgDiv.textContent = langData[65] ? langData[65] : 'Registrations has not started yet.'
    msgDiv.style.display = 'block'
  }
  else if (new Date(data.registrationDate.endDate) < new Date()) {
    let msgDiv = parentelement.querySelector('#registrationMsg');
    msgDiv.textContent = langData[66] ? langData[66] : 'Registrations has been closed.'
    msgDiv.style.display = 'block'
  }
  else {
    let ticketSelect = parentelement.querySelector('#ticketSelect');
    ticketSelect.style.display = 'block'
    // Tickets page 
    let displaySelectedData = {};
    let selectedtickets = {};
    let total = 0;
    let selectCount = {
      count: 0
    }
    const ticketOptions = parentelement.querySelector('#ticketOptions');
    ticketGeneration(parentelementid, parentelement, data.ticket, campaignType, selectedtickets, ticketOptions, data.reservationType, total, "", data.currency, selectCount, displaySelectedData);
    let ifields = []
    ticketSelect.addEventListener('submit', async (e) => {
      e.preventDefault();
      const totalAmount = parentelement.querySelector('#totalAmount');
      total = totalAmount.textContent;
      const ticketerror = parentelement.querySelector('#ticketerror');
      ticketerror.textContent = '';
      if (selectCount.count <= 0) {
        ticketerror.textContent = langData[64] ? langData[64] : 'Select atleast one ticket';
      }
      else {
        ticketSelect.style.display = 'none';
        const selectedTicketKey = Object.keys(selectedtickets);
        let matchingTicket = data.ticket.filter(ticket => selectedTicketKey.includes(ticket.id));
        const ticketCount = {};
        matchingTicket.forEach(ticket => {
          const Type = ticket.title;
          if (Type in ticketCount) {
            ticketCount[Type] += selectedtickets[ticket.id] || 0;
          } else {
            ticketCount[Type] = selectedtickets[ticket.id] || 0;
          }
        });
        const paragraphs = Object.keys(ticketCount).map(type => {
          const count = ticketCount[type];
          return `${count} ${type}`;
        });
        const finalParagraph = langData[18] ? paragraphs.join(` ${langData[18]} `) : paragraphs.join(' and ');
        const userDetailsInputDetail = parentelement.querySelector('#userDetails_inp_det')

        if (langData[67] && langData[68]) {
          userDetailsInputDetail.textContent =
            `${langData[67].replace(/\{selectedTickets\}/g, finalParagraph).replace(/\{price\}/g, `${widgetCurrency[data.currency]} ${total}`)
            + ` ` + langData[68]}`
        }
        else {
          userDetailsInputDetail.textContent = `You have selected ${finalParagraph} ticket. Your total cost is ${widgetCurrency[data.currency]} ${total}. Please provide your details in the form below to proceed with booking.`
        }
        // Input Field Creation
        const InputFieldsElement = parentelement.querySelector('#InputFields');
        ifields = [{ label: 'Name', name: 'Name' }, { label: 'Email', name: 'visitorEmail' }];
        while (InputFieldsElement.firstChild) {
          InputFieldsElement.removeChild(InputFieldsElement.firstChild);
        }
        const nameFieldsElement = parentelement.querySelector('#nameFieldsElement')
        const emailFieldsElement = parentelement.querySelector('#emailFieldsElement')
        const isexsistEmail = parentelement.querySelector('#visitorEmail');
        if (!window[parentelementid + "_is_verify"] && !isexsistEmail) emailfieldcreation(nameFieldsElement, emailFieldsElement, campaignID, parentelement, parentelementid);
        inputFieldsCreation(parentelementid, data, ifields, InputFieldsElement);
        userDetails.style.display = 'block';
      }
    })
    async function handlefinal(parentelement) {
      const selectedPaymentType = parentelement.querySelector('input[name="paymentType"]:checked');
      var userInfo = {};
      ifields.forEach((field) => {
        let input = parentelement.querySelector(`#${field.name}`);
        let inputvalue;
        // for checkbox and radio button 
        if (!input) {
          input = document.querySelectorAll(`input[name="${field.name}"]:checked`);
          inputvalue = Array.from(input).map(ele => ele.value);
        }
        else {
          inputvalue = input.value;
        }
        userInfo[field.label] = inputvalue;
      });
      let bookingDetails = {
        selectedRecords: selectedtickets,
        userInfo: userInfo,
      }
      if (total <= 0) {
        tableSkeletonLoader(parentelement);
        bookingDetails.registrationType = 'free'
        let finaldata = {
          campaignID,
          campaignType: data.campaignID.type,
          visitorId: window[parentelementid + "_visitorId"],
          bookingDetails
        }
        let res = await saveData(parentelementid, finaldata);
        if (res) {
          const thankuLoader = parentelement.querySelector('#thanku_loader');
          thankuLoader.style.display = 'none';
          const thankyou = parentelement.querySelector('#thankyoumsg');
          thankyou.style.display = 'block';
          thankyou.textContent = data.thankyouMessage;
          const orderdetails = parentelement.querySelector('#orderdetails')
          orderdetails.style.display = 'block';
          const bill = parentelement.querySelector('#bill');
          bill.style.display = 'none';
          const trans = parentelement.querySelector('#trans');
          trans.style.display = 'none'
          const pay_remove = parentelement.querySelector('#pay_remove');
          pay_remove.style.display = 'none';
          const totalAmount = parentelement.querySelector('#tot_amount');
          totalAmount.textContent = 0;
          const table = parentelement.querySelector('#detail_table');
          const tbody = document.createElement('tbody');
          let row;
          for (const key in finaldata.bookingDetails.selectedRecords) {
            row = tbody.insertRow();
            const cell_1 = row.insertCell();
            cell_1.textContent = `${displaySelectedData[key].title}`;
            const cell_2 = row.insertCell();
            cell_2.textContent = `${bookingDetails.selectedRecords[key]}`;
            const cell_3 = row.insertCell();
            cell_3.textContent = `${displaySelectedData[key].price}`;
            const cell_4 = row.insertCell();
            cell_4.textContent = `${finaldata.bookingDetails.selectedRecords[key] * displaySelectedData[key].price}`;
          }
          table.appendChild(tbody);
        }
      }
      else {
        bookingDetails.paymentMode = selectedPaymentType.value;
        const isexsistEmail = parentelement.querySelector('#visitorEmail');
        await handlePayment(parentelementid, selectedPaymentType.value, data, campaignID, bookingDetails, total, email = isexsistEmail.value, displaySelectedData);
      }
    }
    const userDetails = parentelement.querySelector('#userDetails')
    userDetails.addEventListener('submit', async (e) => {
      e.preventDefault();
      const isValidForm = validateForm(ifields, parentelement, parentelementid);
      if ((window[parentelementid + "_is_verify"] == false)) {
        let errorElement = parentelement.querySelector(`#visitorEmail-error`);
        errorElement.textContent = langData[39] ? langData[39] : `Please verify your email.`;
      }
      if (isValidForm && window[parentelementid + "_is_verify"]) {
        userDetails.style.display = 'none';
        if (total <= 0) {
          handlefinal(parentelement);
        }
        else {
          finalSubmit.style.display = 'block';
          const payMethods = parentelement.querySelector('#payMethods');
          while (payMethods.firstChild) {
            payMethods.removeChild(payMethods.firstChild);
          }
          paymentOptionCreation(data, payMethods, parentelementid);
          const selectedTicketKey = Object.keys(selectedtickets);
          let matchingTicket = data.ticket.filter(ticket => selectedTicketKey.includes(ticket.id));
          const ticketCount = {};
          matchingTicket.forEach(ticket => {
            const Type = ticket.title;
            if (Type in ticketCount) {
              ticketCount[Type] += selectedtickets[ticket.id] || 0;
            } else {
              ticketCount[Type] = selectedtickets[ticket.id] || 0;
            }
          });
          const paragraphs = Object.keys(ticketCount).map(type => {
            const count = ticketCount[type];
            return `${count} ${type}`;
          });
          const finalParagraph = langData[18] ? paragraphs.join(` ${langData[18]} `) : paragraphs.join(' and ');
          const paymentInfo = parentelement.querySelector('#p2');

          if (langData[67] && langData[63]) {
            paymentInfo.textContent =
              `${langData[67].replace(/\{selectedTickets\}/g, finalParagraph).replace(/\{price\}/g, `${widgetCurrency[data.currency]} ${total}`)
              + ` ` + langData[63]}`
          }
          else {
            paymentInfo.textContent = `You have selected ${finalParagraph} Ticket.Your total payable amount is ${widgetCurrency[data.currency]} ${total}. How you would like to pay: `;
          }
        }
      }
    })
    const finalSubmit = parentelement.querySelector('#finalSubmit')
    finalSubmit.addEventListener('submit', async (e) => {
      e.preventDefault();
      const selectedPaymentType = document.querySelector('input[name="paymentType"]:checked');
      const payoptionerror = parentelement.querySelector('#payoptionerror');
      payoptionerror.textContent = ''
      if (total > 0 && !selectedPaymentType) {
        payoptionerror.textContent = langData[33] ? langData[33] : 'Please Select a option.'
      }
      else {
        finalSubmit.style.display = 'none';
        handlefinal(parentelement);
      }
    })
  }
}

async function bookingSeatTableRoom(data, campaignID, campaignType, parentelementid, enablertl) {

  let langData = window[parentelementid + "_lang"];
  const parentelement = document.getElementById(parentelementid);
  window[parentelementid + "_is_verify"] = false;
  if (data.reservationType === 'room') {
    parentelement.innerHTML = `<div class="widget_form_box">
  <div class="widget_heading_wrapper">
    <div>
      <h2>${data.headline}</h2>
      <h5>${data.subHeadline}</h5>
    </div>
  </div>
  <div class="widget_event_detail_wrapper">
    <div class='widget_event_content_wrap'>
      <span><svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="14" height="14">
          <path d="M12,6a4,4,0,1,0,4,4A4,4,0,0,0,12,6Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,12,12Z" />
          <path
            d="M12,24a5.271,5.271,0,0,1-4.311-2.2c-3.811-5.257-5.744-9.209-5.744-11.747a10.055,10.055,0,0,1,20.11,0c0,2.538-1.933,6.49-5.744,11.747A5.271,5.271,0,0,1,12,24ZM12,2.181a7.883,7.883,0,0,0-7.874,7.874c0,2.01,1.893,5.727,5.329,10.466a3.145,3.145,0,0,0,5.09,0c3.436-4.739,5.329-8.456,5.329-10.466A7.883,7.883,0,0,0,12,2.181Z" />
        </svg>
      </span>
      <div>
      <p>${langData[3] ? langData[3] : `Venue:`}</p>
        <h4 id='roomaddress'></h4>
      </div>
    </div>
  <div class='widget_event_content_wrap' style='margin-bottom:15px'>
    <span> <svg width="14" height="14" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.5413 11.75H12.4163V13.625H10.5413V11.75ZM3.97876 11.75H7.72876V13.625H3.97876V11.75Z" />
        <path
          d="M0.19751 14.5625C0.19751 15.3379 0.828322 16 1.60376 16H14.7913C15.5667 16 16.1975 15.3379 16.1975 14.5625V4.6875H0.19751V14.5625ZM13.3538 14.0938C13.3538 14.3528 13.1441 14.5625 12.885 14.5625H10.0725C9.81342 14.5625 9.60376 14.3528 9.60376 14.0938V11.2812C9.60376 11.0222 9.81342 10.8125 10.0725 10.8125H12.885C13.1441 10.8125 13.3538 11.0222 13.3538 11.2812V14.0938ZM3.04126 6.59375C3.04126 6.33466 3.25092 6.125 3.51001 6.125H12.885C13.1441 6.125 13.3538 6.33466 13.3538 6.59375V9.40625C13.3538 9.66534 13.1441 9.875 12.885 9.875H3.51001C3.25092 9.875 3.04126 9.66534 3.04126 9.40625V6.59375ZM3.04126 11.2812C3.04126 11.0222 3.25092 10.8125 3.51001 10.8125H8.19751C8.4566 10.8125 8.66626 11.0222 8.66626 11.2812V14.0938C8.66626 14.3528 8.4566 14.5625 8.19751 14.5625H3.51001C3.25092 14.5625 3.04126 14.3528 3.04126 14.0938V11.2812Z" />
        <path
          d="M3.97876 7.0625H12.4163V8.9375H3.97876V7.0625ZM14.7913 0H1.60376C0.828322 0 0.19751 0.630813 0.19751 1.40625V3.75H16.1975V1.40625C16.1975 0.630813 15.5667 0 14.7913 0ZM3.51001 2.34375C3.25113 2.34375 3.04126 2.13387 3.04126 1.875C3.04126 1.61606 3.25113 1.40625 3.51001 1.40625C3.76888 1.40625 3.97876 1.61606 3.97876 1.875C3.97876 2.13387 3.76888 2.34375 3.51001 2.34375ZM5.38501 2.34375C5.12613 2.34375 4.91626 2.13387 4.91626 1.875C4.91626 1.61606 5.12613 1.40625 5.38501 1.40625C5.64388 1.40625 5.85376 1.61606 5.85376 1.875C5.85376 2.13387 5.64388 2.34375 5.38501 2.34375ZM7.26001 2.34375C7.00113 2.34375 6.79126 2.13387 6.79126 1.875C6.79126 1.61606 7.00113 1.40625 7.26001 1.40625C7.51888 1.40625 7.72876 1.61606 7.72876 1.875C7.72876 2.13387 7.51888 2.34375 7.26001 2.34375Z" />
      </svg></span>
    <div>
      <div class="d-flex">
        <p>${langData[27] && langData[70] ? langData[70] + ` ` + langData[27] : `CheckIn Time:`}</p>
        <h4 id='roomcheckin'></h4>
      </div>
      <div class="d-flex">
        <p>${langData[27] && langData[71] ? langData[71] + ` ` + langData[27] : `CheckOut Time:`}</p>
        <h4 id='roomcheckout'></h4>
      </div>
    </div>
  </div>
  <div class='widget_event_content_wrap' style="display: none" id="phone_cont">
                <span>
                <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 32 32" viewBox="0 0 32 32" id="call"><g><path d="M13.323,18.677c-1.462-1.462-2.582-3.252-3.343-5.385c-0.183-0.518-0.03-1.097,0.358-1.485l2.125-2.125
                c1.18-1.18,1.18-3.1,0-4.28L9.941,2.882c-1.18-1.18-3.092-1.173-4.273,0.008L4.625,3.933C2.721,5.837,1.708,8.51,2.074,11.175
                c0.602,4.532,2.742,8.652,6.413,12.338c3.686,3.671,7.806,5.811,12.338,6.413c2.666,0.366,5.339-0.647,7.243-2.551l1.043-1.043
                c1.18-1.18,1.188-3.092,0.008-4.273l-2.521-2.521c-1.18-1.18-3.1-1.18-4.28,0l-2.125,2.125c-0.388,0.388-0.967,0.541-1.485,0.358
                C16.575,21.259,14.785,20.14,13.323,18.677z"></path><path d="M26.619,4.593h-6.746c-1.105,0-2,0.895-2,2v4.361c0,1.105,0.895,2,2,2h1.783l1.191,1.206c0.212,0.215,0.559,0.215,0.771,0
                l1.191-1.206h1.809c1.105,0,2-0.895,2-2V6.593C28.619,5.489,27.724,4.593,26.619,4.593z M20.921,9.378
                c-0.334,0-0.604-0.271-0.604-0.604s0.27-0.604,0.604-0.604c0.334,0,0.604,0.271,0.604,0.604S21.255,9.378,20.921,9.378z
                M23.246,9.378c-0.334,0-0.604-0.271-0.604-0.604s0.271-0.604,0.604-0.604s0.604,0.271,0.604,0.604S23.58,9.378,23.246,9.378z
                M25.571,9.378c-0.334,0-0.604-0.271-0.604-0.604s0.271-0.604,0.604-0.604s0.604,0.271,0.604,0.604S25.905,9.378,25.571,9.378z"></path></g></svg>
                </span>
                <div class="d-flex">
                    <p>${langData[9] ? langData[9] : `Contact:`}</p>
                    <h4 id='contact_detail'></h4>
                </div>
              </div>
  </div>
<div id="dateandtype">
  <form id="selectCheckInOut" autocomplete="off">
    <div class="widget_inp_list_wrap">
      <div class="widget_ipt_wrap">
        <label>${langData[70] ? langData[70] : `Check In`}</label>
        <input type="text" name="check_in" placeholder=${langData[23] ? langData[23] : `CheckIn Date`} id="selectedCheckInDate" data-language='en'>
        <span class='error' id='checkindateerror'></span>
      </div>
      <div class="widget_ipt_wrap">
        <label>${langData[71] ? langData[71] : `Check Out`}</label>
        <input type="text" placeholder="${langData[23] ? langData[23] : `CheckOut Date`}" name="check_out" id="selectedCheckOutDate" data-language='en'>
        <span class='error' id='checkoutdateerror'></span>
      </div>
    </div>
  </form>
  <div style="display:none" id="roomTypes">
    <p id="select_check_in"></p>
    <div class="widget_ticket_list_wrap">
      <h4>${langData[72] ? langData[72] : `Select`} ${(langData[73] && langData[74] && langData[75]) ? ((data.reservationType == 'room') ? langData[73] : (data.reservationType == 'seat') ? langData[74] : langData[75]) : (data.reservationType).toUpperCase()}</h4>
      <div class='skeleton_flex' id="room_loader">
        <div class='skeleton skeleton-img'></div>
        <div class='skeleton skeleton-room-content'></div>
      </div>
      <div id="roomOptions"></div>
    </div>
    <div id='ifAvailable' class="resFlex">
    <div style="text-align:end;margin-bottom:20px;">
    <div class='widget_text_left' style="margin-bottom:0px;">
    ${langData[16] ? langData[16] : `Total`} - <span id='campaignCurrency'></span><span id='totalAmount'>0</span>    
      </div>
      <span class='error' id='ticketerror'></span>
  </div>
      <div class="widget_btn_box_Wrapper">
        <button type="button" class="widget_btn_css" id='roomSelect'>${langData[4] ? langData[4] : `Continue`}</button>
      </div>
    </div>
    </div>
    <div id='soldOutbtn' style="display: none">
      <div id='soldOutMsg'></div>
      <div class="widget_btn_box_Wrapper"></div>
    </div>
</div>
  <form style="display: none" id='userDetails' novalidate>
    <p id="userDetail_para" class="prev_detail">Please provide your details in the form below to proceed with booking.</p>
    <div id="nameFieldsElement"> </div>
    <div id="emailFieldsElement"> </div>
    <div id="InputFields"> </div>
    <div class="widget_btn_box_Wrapper">
      <button type="button" class="widget_btn_css_back" onclick='backButtonClick("userDetails","dateandtype","${parentelementid}")'>${langData[8] ? langData[8] : `Back`}</button>
      <button type="submit" class="widget_btn_css">${langData[4] ? langData[4] : `Continue`}</button>
    </div>
  </form>
  <form style="display: none" id='finalSubmit'>
    <p id='bookInfo' class="prev_detail"></p>
    <div id="payMethods"></div>
    <span class='error' id='payoptionerror'></span>
    <div class="widget_btn_box_Wrapper">
      <button type="button" class="widget_btn_css_back" onclick='backButtonClick("finalSubmit","userDetails","${parentelementid}")'>${langData[8] ? langData[8] : `Back`}</button>
      <button type="submit" class="widget_btn_css">${langData[11] ? langData[11] : `Pay`}</button>
    </div>
  </form>
  <div id='widget_payment_checkout' style="display: none">
    <div id="checkout">
      <!-- stripe checkout form -->
    </div>
    <div id="paypal_loader"></div>
    <div id="paypal-button-container"></div>
    <div class="widget_btn_box_Wrapper">
      <button type="button" class="widget_btn_css_back"
        onclick='backButtonClick("widget_payment_checkout","finalSubmit","${parentelementid}")'>Back</button>
    </div>
  </div>
  <div id="thanku_loader"> </div>
  <div class='widget_thanku_box'>
    <p id='thankyoumsg'></p>
  </div>
  <div id="orderdetails" style="display: none" class="order_detail">
    <div class='detail_wrap'>
      <div class='detail_tag' id="bill">
        <div>${langData[10] ? langData[10] : `Bill To :`}</div><span id="bill_to"></span>
      </div>
      <div class='detail_tag'>
        <div>${langData[31] ? langData[31] : `Payment Method :`}:</div><span id="pay_method"></span>
      </div>
      <div class='detail_tag' id="trans">
        <div>${langData[32] ? langData[32] : `Transaction Id :`}</div><span id="transaction"></span>
      </div>
      <div class='detail_tag'>
        <div>${langData[70] && langData[23] ? langData[70] + ` ` + langData[23] : `CheckIn Date :`}</div><span id="check_in"></span>
      </div>
      <div class='detail_tag'>
        <div>${langData[71] && langData[23] ? langData[71] + ` ` + langData[23] : `CheckOut Date :`}</div><span id="check_out"></span>
      </div>
    </div>
    <div class='table_conatiner'>
      <table class='table' id="detail_table">
        <thead>
        <th>${langData[19] ? langData[19] : `Selected`}</th>
        <th>${langData[20] ? langData[20] : `Quantity`}</th>
        <th>${langData[21] ? langData[21] : `Price`}</th>
        <th>${langData[22] ? langData[22] : `Amount`}</th>
        </thead>
      </table>
    </div>
    <div class='detail_tag'>
      <div>${langData[17] ? langData[17] : `Total Amount :`}</div><span id="tot_amount"></span>
    </div>
  </div>
</div>
</div>
</div>`;
    if (enablertl) {
      parentelement.classList.add('rtl');
    }

    if (data.campaignID?.phone) {
      const phone_cont = parentelement.querySelector('#phone_cont');
      phone_cont.style.display = 'flex';
      const contact_detail = parentelement.querySelector('#contact_detail');
      contact_detail.textContent = data.campaignID.phone;
    }
    const hoteladdress = parentelement.querySelector('#roomaddress');
    hoteladdress.textContent = data.campaignID.address;
    const roomcheckin = parentelement.querySelector('#roomcheckin');
    roomcheckin.textContent = new Date(data.checkInTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const roomcheckout = parentelement.querySelector('#roomcheckout');
    roomcheckout.textContent = new Date(data.checkOutTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    let minDate = new Date();
    minDate.setDate(minDate.getDate() + 1);
    let dateCheckInInput = parentelement.querySelector('#selectedCheckInDate')
    let dateCheckoutInput = parentelement.querySelector('#selectedCheckOutDate');


    const result = await fetch(HOST_URL + '/api/externalWidgetApi', {
      method: 'PUT',
      body: JSON.stringify({ campaign_id: campaignID, campaign_type: campaignType, disabledates: true, roomTypes: data.rooms })
    });
    let response = await result.json();
    let disabledata = response.data;

    const handledateValid = (val) => {
      let errorspan = parentelement.querySelector('#checkoutdateerror');
      if (val) {
        errorspan.textContent = langData[87] ? langData[87] : 'Check-out date should be greater than check-in date.'
      }
      else {
        errorspan.textContent = '';
      }
    }

    let dpMin, dpMax;
    dpMin = new AirDatepicker(dateCheckInInput, {
      locale: _defaultEN,
      onSelect({ date }) {
        let datecheckout = new Date(dateCheckoutInput.value);
        if (date > datecheckout) {
          handledateValid(true);
        }
        else {
          handledateValid(false)
        }
        dpMin.hide();
        ondatesubmit();
      },
      onRenderCell: function ({ date, cellType }) {
        const formattedDate = date.toDateString();
        const isDisabled = disabledata.includes(formattedDate);
        return {
          disabled: isDisabled
        };
      },
      minDate: minDate
    })
    dpMax = new AirDatepicker(dateCheckoutInput, {
      locale: _defaultEN,
      onSelect({ date }) {
        let datecheckin = new Date(dateCheckInInput.value);
        if (date < datecheckin) {
          handledateValid(true);
        }
        else {
          handledateValid(false)
        }
        dpMax.hide();
        ondatesubmit();
      },
      onRenderCell: function ({ date, cellType }) {
        const formattedDate = date.toDateString();
        const isDisabled = disabledata.includes(formattedDate);
        return {
          disabled: isDisabled
        };
      },
      minDate: minDate
    })
    let total = 0;
    let selectedRooms = {};
    let displaySelectedData = {};
    const selectCheckInOut = parentelement.querySelector('#selectCheckInOut');

    let ondatesubmit = async () => {
      const checkinerrorspan = parentelement.querySelector('#checkindateerror');
      checkinerrorspan.textContent = ''
      const checkouterrorspan = parentelement.querySelector('#checkoutdateerror');
      checkouterrorspan.textContent = ''
      let spaceValidationRegex = /^\s*$/;
      if (!dateCheckInInput.value || !dateCheckoutInput.value || spaceValidationRegex.test(dateCheckInInput.value) || spaceValidationRegex.test(dateCheckInInput.value)) {
        if (!dateCheckInInput.value || spaceValidationRegex.test(dateCheckInInput.value)) {
          let errorspan = parentelement.querySelector('#checkindateerror');
          errorspan.textContent = langData[41] ? langData[41] : 'Please select a date.'
        }
        if (!dateCheckoutInput.value || spaceValidationRegex.test(dateCheckoutInput.value)) {
          let errorspan = parentelement.querySelector('#checkoutdateerror');
          errorspan.textContent = langData[41] ? langData[41] : 'Please select a date.'
        }
        const roomTypesdiv = parentelement.querySelector('#roomTypes');
        roomTypesdiv.style.display = 'none';
      }
      else if (dateCheckInInput.value >= dateCheckoutInput.value) {
        let errorspan = parentelement.querySelector('#checkoutdateerror');
        errorspan.textContent = langData[87] ? langData[87] : 'Check-out date should be greater than check-in date.';
        const roomTypesdiv = parentelement.querySelector('#roomTypes');
        roomTypesdiv.style.display = 'none';
      }
      else {
        const roomTypesdiv = parentelement.querySelector('#roomTypes');
        roomTypesdiv.style.display = 'block';
        const room_loader = parentelement.querySelector('#room_loader');
        room_loader.style.display = 'flex';
        // Track of booked Slots 
        const result = await fetch(HOST_URL + '/api/externalWidgetApi', {
          method: 'PUT',
          body: JSON.stringify({ dateCheckIn: dateCheckInInput.value, dateCheckout: dateCheckoutInput.value, campaign_id: campaignID, campaign_type: campaignType, })
        });
        let response = await result.json();
        if (response) {

          const roomOptions = parentelement.querySelector('#roomOptions');
          const campaignCurrency = parentelement.querySelector('#campaignCurrency');
          campaignCurrency.textContent = '';
          const totalAmount = parentelement.querySelector('#totalAmount');
          total = 0;
          totalAmount.textContent = 0;
          while (roomOptions.firstChild) {
            roomOptions.removeChild(roomOptions.firstChild);
          }

          room_loader.style.display = 'none';
          RoomGeneration(parentelementid, parentelement, data.rooms, campaignID, selectedRooms, roomOptions, total, bookedSlots = response.data, data.currency, displaySelectedData);
        }
      }
    }

    const roomSelect = parentelement.querySelector('#roomSelect');
    const dateandtype = parentelement.querySelector('#dateandtype');
    const userDetails = parentelement.querySelector('#userDetails');
    const finalSubmit = parentelement.querySelector('#finalSubmit');
    let ifields = [];
    roomSelect.addEventListener('click', async (e) => {
      e.preventDefault();
      const totalAmount = parentelement.querySelector('#totalAmount');
      total = totalAmount.textContent;
      const ticketerror = parentelement.querySelector('#ticketerror');
      ticketerror.textContent = '';
      if (total <= 0) {
        ticketerror.textContent = langData[79] ? langData[79] : 'Select atleast one room';
      }
      else {
        dateandtype.style.display = 'none';
        const userDetail_para = parentelement.querySelector('#userDetail_para');
        const selectedRoomsKey = Object.keys(selectedRooms);
        let matchingRooms = data.rooms.filter(room => selectedRoomsKey.includes(room.id));
        const roomCounts = {};
        matchingRooms.forEach(room => {
          const roomType = room.name;
          if (roomType in roomCounts) {
            roomCounts[roomType] += selectedRooms[room.id] || 0;
          } else {
            roomCounts[roomType] = selectedRooms[room.id] || 0;
          }
        });
        const paragraphs = Object.keys(roomCounts).map(type => {
          const count = roomCounts[type];
          return `${count} ${type}`;
        });
        const finalParagraph = langData[18] ? paragraphs.join(` ${langData[18]} `) : paragraphs.join(' and ');
        if (langData[84] && langData[80]) {
          userDetail_para.textContent =
            `${langData[81].replace(/\{selectedRooms\}/g, finalParagraph).replace(/\{dateCheckIn\}/g, customizeDateFormate(dateCheckInInput.value)).replace(/\{dateCheckout\}/g, customizeDateFormate(dateCheckoutInput.value)).replace(/\{price\}/g, `${widgetCurrency[data.currency]} ${total}`)
            + ` ` + langData[82]}`
        }
        else {
          userDetail_para.textContent = `You have selected ${finalParagraph} for ${customizeDateFormate(dateCheckInInput.value)} to ${customizeDateFormate(dateCheckoutInput.value)}. Your total cost is ${widgetCurrency[data.currency]} ${total}. Please provide your details in the form below to proceed with booking. `
        }
        ifields = [{ label: 'Name', name: 'Name' }, { label: 'Email', name: 'visitorEmail' }];
        const InputFieldsElement = parentelement.querySelector('#InputFields');
        const emailFieldsElement = parentelement.querySelector('#emailFieldsElement')
        const nameFieldsElement = parentelement.querySelector('#nameFieldsElement')
        while (InputFieldsElement.firstChild) {
          InputFieldsElement.removeChild(InputFieldsElement.firstChild);
        }
        const isexsistEmail = parentelement.querySelector('#visitorEmail');
        if (!window[parentelementid + "_is_verify"] && !isexsistEmail) emailfieldcreation(nameFieldsElement, emailFieldsElement, campaignID, parentelement, parentelementid);
        inputFieldsCreation(parentelementid, data, ifields, InputFieldsElement);
        userDetails.style.display = 'block';
      }
    });
    userDetails.addEventListener('submit', async (e) => {
      e.preventDefault();
      const isValidForm = validateForm(ifields, parentelement, parentelementid);
      if ((window[parentelementid + "_is_verify"] == false)) {
        let errorElement = parentelement.querySelector(`#visitorEmail-error`);
        errorElement.textContent = langData[39] ? langData[39] : `Please verify your email.`;
      }
      if (isValidForm && window[parentelementid + "_is_verify"]) {
        userDetails.style.display = 'none';
        finalSubmit.style.display = 'block';
        // prevent duplicate creation on back functionality
        const payMethods = parentelement.querySelector('#payMethods');
        while (payMethods.firstChild) {
          payMethods.removeChild(payMethods.firstChild);
        }
        paymentOptionCreation(data, payMethods, parentelementid)
        const bookInfo = parentelement.querySelector('#bookInfo');
        const selectedRoomsKey = Object.keys(selectedRooms);
        let matchingRooms = data.rooms.filter(room => selectedRoomsKey.includes(room.id));
        const roomCounts = {};
        matchingRooms.forEach(room => {
          const roomType = room.name;
          if (roomType in roomCounts) {
            roomCounts[roomType] += selectedRooms[room.id] || 0;
          } else {
            roomCounts[roomType] = selectedRooms[room.id] || 0;
          }
        });
        const paragraphs = Object.keys(roomCounts).map(type => {
          const count = roomCounts[type];
          return `${count} ${type}`;
        });
        const finalParagraph = langData[18] ? paragraphs.join(` ${langData[18]} `) : paragraphs.join(' and ');
        if (langData[81] && langData[80]) {
          bookInfo.textContent =
            ` ${langData[81].replace(/\{selectedRooms\}/g, finalParagraph).replace(/\{dateCheckIn\}/g, customizeDateFormate(dateCheckInInput.value)).replace(/\{dateCheckout\}/g, customizeDateFormate(dateCheckoutInput.value)).replace(/\{price\}/g, `${widgetCurrency[data.currency]} ${total}`)
            + ` ` + langData[80]}`
        }
        else {
          bookInfo.textContent = `You have selected ${finalParagraph} for ${customizeDateFormate(dateCheckInInput.value)} to ${customizeDateFormate(dateCheckoutInput.value)}. Your total cost is ${widgetCurrency[data.currency]} ${total}. How you would like to pay: `;
        }
      }
    });
    finalSubmit.addEventListener('submit', async (e) => {
      e.preventDefault();
      const selectedPaymentType = document.querySelector('input[name="paymentType"]:checked');
      const payoptionerror = parentelement.querySelector('#payoptionerror');
      payoptionerror.textContent = ''
      if (!selectedPaymentType) {
        payoptionerror.textContent = langData[33] ? langData[33] : 'Please Select a option'
      }
      else {
        var userInfo = {};
        ifields.forEach((field) => {
          let input = parentelement.querySelector(`#${field.name}`);
          let inputvalue;
          // for checkbox and radio button 
          if (!input) {
            input = document.querySelectorAll(`input[name="${field.name}"]:checked`);
            inputvalue = Array.from(input).map(ele => ele.value);
          }
          else {
            inputvalue = input.value;
          }
          userInfo[field.label] = inputvalue;
        });
        let bookingDetails = {
          Checkindate: dateCheckInInput.value,
          Checkoutdate: dateCheckoutInput.value,
          selectedRecords: selectedRooms,
          userInfo: userInfo,
          paymentMode: selectedPaymentType.value,
        }
        const isexsistEmail = parentelement.querySelector('#visitorEmail');
        finalSubmit.style.display = 'none';
        await handlePayment(parentelementid, selectedPaymentType.value, data, campaignID, bookingDetails, total, email = isexsistEmail.value, displaySelectedData);
      }
    })
  }
  // for type seat and table
  else {

    parentelement.innerHTML = `
    <div class='widget_form_box' >
    <div class='widget_heading_wrapper'>
        <div>
        <h2>${data.headline}</h2>
        <h5>${data.subHeadline}</h5>
        </div>
    </div>
  <div>
  <div class='widget_event_detail_wrapper'>
  <div>
      <div class='widget_event_content_wrap'>
          <span><svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="14" height="14"><path d="M12,6a4,4,0,1,0,4,4A4,4,0,0,0,12,6Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,12,12Z" /><path d="M12,24a5.271,5.271,0,0,1-4.311-2.2c-3.811-5.257-5.744-9.209-5.744-11.747a10.055,10.055,0,0,1,20.11,0c0,2.538-1.933,6.49-5.744,11.747A5.271,5.271,0,0,1,12,24ZM12,2.181a7.883,7.883,0,0,0-7.874,7.874c0,2.01,1.893,5.727,5.329,10.466a3.145,3.145,0,0,0,5.09,0c3.436-4.739,5.329-8.456,5.329-10.466A7.883,7.883,0,0,0,12,2.181Z" /></svg>
          </span>
          <div>
              <p>${langData[3] ? langData[3] : `Venue:`}</p>
              <h4 id='appintVenue'></h4>
          </div>
      </div>
  </div>
  <div class='widget_event_content_wrap' style="display: none" id="phone_cont">
  <span>
  <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 32 32" viewBox="0 0 32 32" id="call"><g><path d="M13.323,18.677c-1.462-1.462-2.582-3.252-3.343-5.385c-0.183-0.518-0.03-1.097,0.358-1.485l2.125-2.125
  c1.18-1.18,1.18-3.1,0-4.28L9.941,2.882c-1.18-1.18-3.092-1.173-4.273,0.008L4.625,3.933C2.721,5.837,1.708,8.51,2.074,11.175
  c0.602,4.532,2.742,8.652,6.413,12.338c3.686,3.671,7.806,5.811,12.338,6.413c2.666,0.366,5.339-0.647,7.243-2.551l1.043-1.043
  c1.18-1.18,1.188-3.092,0.008-4.273l-2.521-2.521c-1.18-1.18-3.1-1.18-4.28,0l-2.125,2.125c-0.388,0.388-0.967,0.541-1.485,0.358
  C16.575,21.259,14.785,20.14,13.323,18.677z"></path><path d="M26.619,4.593h-6.746c-1.105,0-2,0.895-2,2v4.361c0,1.105,0.895,2,2,2h1.783l1.191,1.206c0.212,0.215,0.559,0.215,0.771,0
  l1.191-1.206h1.809c1.105,0,2-0.895,2-2V6.593C28.619,5.489,27.724,4.593,26.619,4.593z M20.921,9.378
  c-0.334,0-0.604-0.271-0.604-0.604s0.27-0.604,0.604-0.604c0.334,0,0.604,0.271,0.604,0.604S21.255,9.378,20.921,9.378z
  M23.246,9.378c-0.334,0-0.604-0.271-0.604-0.604s0.271-0.604,0.604-0.604s0.604,0.271,0.604,0.604S23.58,9.378,23.246,9.378z
  M25.571,9.378c-0.334,0-0.604-0.271-0.604-0.604s0.271-0.604,0.604-0.604s0.604,0.271,0.604,0.604S25.905,9.378,25.571,9.378z"></path></g></svg>
  </span>
  <div>
      <p>${langData[9] ? langData[9] : `Contact:`}</p>
      <h4 id='contact_detail'></h4>
  </div>
</div>
  </div>
</div>
    <div id = 'widget_datetime'>
        <form id='selectDate'  autocomplete="off">
                <div class='widget_ipt_wrap'>
                    <label>${langData[23] ? langData[23] : `Date`}</label>
                    <input type="text" id="selectedBookingDate" data-language='en'>
                    <span class='error' id='dateerror'></span>
                </div>
            </form>
            <div style="display: none" id='timeSlots'>
            <div class='widget_ipt_wrap'>
                <label>${langData[1] ? langData[1] : `Time Slots`}</label>
            </div>
            <div class="widget_radio_btn_wrapper" id="timeSlotsContainer">
          </div>
          <span class='error' id='timesloterror'></span>
        <div id="bookedmessage"></div>
        <form style="display: none" id='ticketSelect'>
        <p id='select_d_t'></p>
            <div class='widget_ticket_list_wrap'>
                <h4>${langData[72] ? langData[72] : `Select`} ${(langData[73] && langData[74] && langData[75]) ? ((data.reservationType == 'room') ? langData[73] : (data.reservationType == 'seat') ? langData[74] : langData[75]) : (data.reservationType).toUpperCase()}</h4>
                <div id='ticketOptions'></div>
            </div>
            <div style="text-align:end;margin-bottom:20px;">
            <div class='widget_text_left' style="margin-bottom:0px;">
            ${langData[16] ? langData[16] : `Total`} - <span id='campaignCurrency'></span><span id='totalAmount'>0</span>
            </div>
            <span class='error' id='ticketerror'></span>
            </div>
            <div class="widget_btn_box_Wrapper">
                <button type="submit" class="widget_btn_css"> ${langData[4] ? langData[4] : `Continue`}</button>
            </div>
        </form>
        </div>
        </div>
        <div id='soldOutbtn' style="display: none">
        <div id='soldOutMsg'> </div>
        </div>
        <form style="display: none" id='userDetails' novalidate>
            <p id="input_detail" class="prev_detail">Please provide your details in the form below to proceed with booking.</p>
            <div id="nameFieldsElement"> </div>
            <div id="emailFieldsElement"> </div>
            <div id="InputFields"> </div>
            <div class="widget_btn_box_Wrapper">
                <button type="button" class="widget_btn_css_back" onclick='backButtonClick("userDetails","widget_datetime","${parentelementid}")'>${langData[8] ? langData[8] : `Back`}</button>
                <button type="submit" class="widget_btn_css">${langData[4] ? langData[4] : `Continue`}</button>
            </div>
        </form>
        <form style="display: none" id='finalSubmit'>
            <p id ='bookInfo' class="prev_detail"></p>
            <div id="payMethods"></div>
            <span class='error' id='payoptionerror'></span>
            <div class="widget_btn_box_Wrapper">
                <button type="button" class="widget_btn_css_back" onclick='backButtonClick("finalSubmit","userDetails","${parentelementid}")'>${langData[8] ? langData[8] : `Back`}</button>
                <button type="submit" class="widget_btn_css">${langData[11] ? langData[11] : `Pay`}</button>
            </div>
        </form>
        <div id='widget_payment_checkout' style="display: none">
        <div id="checkout">
        <!-- stripe checkout form -->
      </div>
      <div id="paypal_loader"></div>
        <div id="paypal-button-container"></div>
        <div class="widget_btn_box_Wrapper">
        <button type="button" class="widget_btn_css_back" onclick='backButtonClick("widget_payment_checkout","finalSubmit","${parentelementid}")'>${langData[8] ? langData[8] : `Back`}</button>
        </div>
        </div>
        <div id="thanku_loader"> </div>
        <div class='widget_thanku_box'>
            <p id='thankyoumsg'></p>
        </div>
        <div id="orderdetails" style="display: none" class="order_detail">
        <div class='detail_wrap'>
            <div class='detail_tag' id="bill"><div>${langData[10] ? langData[10] : `Bill To :`}</div><span id="bill_to"></span></div>
            <div class='detail_tag' ><div>${langData[19] && langData[23] ? langData[19] + ` ` + langData[23] : `Booking Date :`} </div><span id="book_date"></span></div>
            <div class='detail_tag'><div>${langData[31] ? langData[31] : `Payment Method :`} </div><span id="pay_method"></span></div>
            <div class='detail_tag' id="trans"><div>${langData[32] ? langData[32] : `Transaction Id :`}</div><span id="transaction"></span></div>
        </div>
        <div class='table_conatiner'>
            <table class='table' id="detail_table">
                <thead>
                    <th>${langData[19] ? langData[19] : `Selected`}</th>
                    <th>${langData[20] ? langData[20] : `Quantity`}</th>
                    <th>${langData[21] ? langData[21] : `Price`}</th>
                    <th>${langData[22] ? langData[22] : `Amount`}</th>
                </thead>
            </table>
        </div>
        <div class='detail_tag'><div>${langData[17] ? langData[17] : `Total Amount :`}</div><span id="tot_amount"></span></div>
        </div>
    </div>
  </div>
    `;

    if (enablertl) {
      parentelement.classList.add('rtl');
    }

    const result = await fetch(HOST_URL + '/api/externalWidgetApi', {
      method: 'PUT',
      body: JSON.stringify({ campaign_id: campaignID, campaign_type: 'seattable', disabledates: true, campaignDetail : data })
    });
    let response = await result.json();
    let disabledata = response.data;

    const appint_Venue = parentelement.querySelector('#appintVenue');
    appint_Venue.textContent = data.campaignID.address;
    if (data.campaignID?.phone) {
      const phone_cont = parentelement.querySelector('#phone_cont');
      phone_cont.style.display = 'flex';
      const contact_detail = parentelement.querySelector('#contact_detail');
      contact_detail.textContent = data.campaignID.phone;
    }
    const datepickerInput = parentelement.querySelector('#selectedBookingDate');
    const selectDate = parentelement.querySelector('#selectDate');
    const ticketSelect = parentelement.querySelector('#ticketSelect');
    let total = 0;
    let displaySelectedData = {};
    let selectedtickets = {};

    let dateAndTypeselect = async () => {
      const errorspan = parentelement.querySelector('#dateerror');
      errorspan.textContent = '';
      const soldOutbtn = parentelement.querySelector('#soldOutbtn');
      if (soldOutbtn) { soldOutbtn.style.display = 'none' }
      if (!datepickerInput.value) {
        const errorspan = parentelement.querySelector('#dateerror');
        errorspan.textContent = langData[41] ? langData[41] : 'Please select a date.'
      }
      else {
        const selectedDate = new Date(datepickerInput.value);
        let timeSlotsContainer = parentelement.querySelector('#timeSlotsContainer')
        while (timeSlotsContainer.firstChild) {
          timeSlotsContainer.removeChild(timeSlotsContainer.firstChild);
        }
        const timeSlots = parentelement.querySelector('#timeSlots');
        timeSlots.style.display = 'block';
        ticketSelect.style.display = 'none';
        timeSlotCreation(parentelementid, parentelement, selectedDate, data, timeSlotsContainer);
        let selectedRadios = parentelement.querySelectorAll('input[name="timeSlot"]');
        selectedRadios.forEach(radio => {
          radio.addEventListener('change', async (e) => {
            const selectedRadio = parentelement.querySelector('input[name="timeSlot"]:checked');
            const selectedTime = (new Date(selectedRadio.value)).toLocaleTimeString();
            let typesOfSeatTable = [];
            if (data.reservationType == 'seat') typesOfSeatTable = data.seats;
            else if (data.reservationType == 'table') typesOfSeatTable = data.tables;
            // Track of booked Slots 
            const result = await fetch(HOST_URL + '/api/externalWidgetApi', {
              method: 'PUT',
              body: JSON.stringify({ date: datepickerInput.value, slotTime: selectedTime, campaign_id: campaignID, campaign_type: campaignType, })
            });
            let response = await result.json();
            if (response) {
              ticketSelect.style.display = 'block';
              const ticketOptions = parentelement.querySelector('#ticketOptions');
              const campaignCurrency = parentelement.querySelector('#campaignCurrency');
              campaignCurrency.textContent = '';
              const totalAmount = parentelement.querySelector('#totalAmount');
              total = 0;
              totalAmount.textContent = 0;
              while (ticketOptions.firstChild) {
                ticketOptions.removeChild(ticketOptions.firstChild);
              }
              ticketGeneration(parentelementid, parentelement, typesOfSeatTable, campaignType, selectedtickets, ticketOptions, data.reservationType, total, bookedSlots = response.data, data.currency, "", displaySelectedData);
            }
          }
          );
        })
      }
    }

    disableDates(data.holidays, data.businessDays, datepickerInput, dateAndTypeselect,disabledata);
    var ifields = [];
    ticketSelect.addEventListener('submit', async (e) => {
      e.preventDefault();
      const totalAmount = parentelement.querySelector('#totalAmount');
      total = totalAmount.textContent;
      const timesloterror = parentelement.querySelector('#timesloterror');
      timesloterror.textContent = ''
      const selectedRadio = parentelement.querySelector('input[name="timeSlot"]:checked');
      if (!selectedRadio) {
        timesloterror.textContent = langData[33] ? langData[33] : 'Please select the time.'
      }
      const ticketerror = parentelement.querySelector('#ticketerror');
      ticketerror.textContent = '';
      if (!selectedRadio) {
        timesloterror.textContent = langData[33] ? langData[33] : 'Please select the time.'
      }
      else if (total <= 0) {
        ticketerror.textContent = langData[79] ? langData[79] : 'Select atleast one option.';
      }
      else {
        let widget_datetime = parentelement.querySelector('#widget_datetime')
        widget_datetime.style.display = 'none';
        ifields = [{ label: 'Name', name: 'Name' }, { label: 'Email', name: 'visitorEmail' }];
        const InputFieldsElement = parentelement.querySelector('#InputFields');
        while (InputFieldsElement.firstChild) {
          InputFieldsElement.removeChild(InputFieldsElement.firstChild);
        }
        const selectedRadio = parentelement.querySelector('input[name="timeSlot"]:checked');
        const selectedTime = (new Date(selectedRadio.value)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        const finalParagraph = selectedType();
        const input_detail = parentelement.querySelector('#input_detail');

        if (langData[84] && langData[82]) {
          input_detail.textContent =
            `${langData[84].replace(/\{selectedSeat-Table\}/g, finalParagraph).replace(/\{selectedDate\}/g, customizeDateFormate(datepickerInput.value)).replace(/\{selectedTime\}/g, selectedTime).replace(/\{price\}/g, `${widgetCurrency[data.currency]} ${total}`)
            + ` ` + langData[82]}`
        }
        else {
          input_detail.textContent = `You have selected  ${finalParagraph} for ${customizeDateFormate(datepickerInput.value)}, ${selectedTime}. Your total cost is ${widgetCurrency[data.currency]} ${total}. Please provide your details in the form below to proceed with booking. `;
        }
        const nameFieldsElement = parentelement.querySelector('#nameFieldsElement')
        const emailFieldsElement = parentelement.querySelector('#emailFieldsElement')
        const isexsistEmail = parentelement.querySelector('#visitorEmail');
        if (!window[parentelementid + "_is_verify"] && !isexsistEmail) emailfieldcreation(nameFieldsElement, emailFieldsElement, campaignID, parentelement, parentelementid);
        inputFieldsCreation(parentelementid, data, ifields, InputFieldsElement);
        userDetails.style.display = 'block';
      }
    });
    function selectedType() {
      const bookInfo = parentelement.querySelector('#bookInfo');
      const selectedSeats = Object.keys(selectedtickets);
      let matchingSeats;
      if (data.reservationType == 'seat') {
        matchingSeats = data.seats.filter(seat => selectedSeats.includes(seat.id));
      } else {
        matchingSeats = data.tables.filter(seat => selectedSeats.includes(seat.id));
      }
      const seatCounts = {};
      matchingSeats.forEach(seat => {
        const seatType = seat.name;
        if (seatType in seatCounts) {
          seatCounts[seatType] += selectedtickets[seat.id] || 0;
        } else {
          seatCounts[seatType] = selectedtickets[seat.id] || 0;
        }
      });
      'input_detail'
      const paragraphs = Object.keys(seatCounts).map(type => {
        const count = seatCounts[type];
        return `${count} ${type}`;
      });
      const finalParagraph = langData[18] ? paragraphs.join(` ${langData[18]} `) : paragraphs.join(' and ');
      return finalParagraph
    }
    const userDetails = parentelement.querySelector('#userDetails');
    userDetails.addEventListener('submit', async (e) => {
      e.preventDefault();
      const isValidForm = validateForm(ifields, parentelement, parentelementid);
      if ((window[parentelementid + "_is_verify"] == false)) {
        let errorElement = parentelement.querySelector(`#visitorEmail-error`);
        errorElement.textContent = langData[39] ? langData[39] : `Please verify your email.`;
      }
      if (isValidForm && window[parentelementid + "_is_verify"]) {
        userDetails.style.display = 'none';
        finalSubmit.style.display = 'block';
        const payMethods = parentelement.querySelector('#payMethods');
        while (payMethods.firstChild) {
          payMethods.removeChild(payMethods.firstChild);
        }
        paymentOptionCreation(data, payMethods, parentelementid)
        const finalParagraph = selectedType();
        const selectedRadio = document.querySelector('input[name="timeSlot"]:checked');
        const selectedTime = (new Date(selectedRadio.value)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        let bookInfo = parentelement.querySelector('#bookInfo');
        if (langData[84] && langData[80]) {
          bookInfo.textContent = `${langData[84].replace(/\{selectedSeat-Table\}/g, finalParagraph).replace(/\{selectedDate\}/g, customizeDateFormate(datepickerInput.value)).replace(/\{selectedTime\}/g, selectedTime).replace(/\{price\}/g, `${widgetCurrency[data.currency]} ${total}`)
            + ` ` + langData[80]}`
        }
        else {
          bookInfo.textContent = `You have selected ${finalParagraph} for ${customizeDateFormate(datepickerInput.value)}, ${selectedTime}. Your total cost is ${widgetCurrency[data.currency]} ${total}. How you would like to pay: `;
        }

      }
    })
    const finalSubmit = parentelement.querySelector('#finalSubmit');
    finalSubmit.addEventListener('submit', async (e) => {
      e.preventDefault();
      const selectedPaymentType = document.querySelector('input[name="paymentType"]:checked');
      const payoptionerror = parentelement.querySelector('#payoptionerror');
      payoptionerror.textContent = ''
      if (!selectedPaymentType) {
        payoptionerror.textContent = langData[33] ? langData[33] : 'Please Select a option.'
      }
      else {
        var userInfo = {};
        ifields.forEach((field) => {
          let input = parentelement.querySelector(`#${field.name}`);
          let inputvalue;
          // for checkbox and radio button 
          if (!input) {
            input = document.querySelectorAll(`input[name="${field.name}"]:checked`);
            inputvalue = Array.from(input).map(ele => ele.value);
          }
          else {
            inputvalue = input.value;
          }
          userInfo[field.label] = inputvalue;
        });
        const selectedTime = document.querySelector('input[name="timeSlot"]:checked');
        let slotTime = new Date(selectedTime.value).toLocaleTimeString();
        let bookingDetails = {
          bookingDate: datepickerInput.value,
          slotTime: slotTime,
          selectedRecords: selectedtickets,
          userInfo: userInfo,
          paymentMode: selectedPaymentType.value,
          bookingType: data.reservationType,
        }
        const isexsistEmail = parentelement.querySelector('#visitorEmail');
        finalSubmit.style.display = 'none';
        await handlePayment(parentelementid, selectedPaymentType.value, data, campaignID, bookingDetails, total, email = isexsistEmail.value, displaySelectedData);
      }
    })
  }
}
// CSS Styling of all templates
function css(template) {
  if (template == 'template1') {
    var template1 = `@charset "UTF-8";@import url(https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap);
    body{
      font-family:Poppins,sans-serif;
    }
    .rtl{
      direction: rtl;
    }
    :root {
      --widget_color: #DD1047;
      --label_Color: #222222;
      --input_border_color: #F0F0F0;
      --heading_color: #DD1047;
      --sub_heading_color: #797979;
      --btn_color: #fff;
      --btn_bg: #DD1047;
    }
  button:focus-visible{
    outline:none;
  }
  button:focus{
    outline:none;
  }
  .otp-input {
    width: 30px;
    height: 30px;
    font-size: 20px;
    text-align: center;
    margin-right: 6px;
    border-radius:5px;
    border-color: var(--btn_bg);
  }
  .widget_form_box {
      max-width: 812px;
      width: 100%;
      background: #fff;
      padding: 40px;
      border-radius: 10px;
      box-shadow: 4px 4px 32px 0px #00000008;
      margin:40px auto;
  }
  .widget_ipt_checkbox{
    margin-bottom: 15px;
  }
 .widget_ipt_checkbox input{
   margin-right: 10px;
 }
 .widget_ipt_checkbox input[type=checkbox]:checked {
    accent-color: var(--widget_color);
 }
  .widget_text_left {
    display: flex;
    justify-content: flex-end;
  }
  .widget_event_detail_wrapper{
    margin-bottom:10px;
  }
  .widget_event_detail_wrapper h4{
    font-size:16px;
    margin: 25px 0;
  }
  .widget_email_field_wrap{
    display:flex;
    gap: 10px;
    align-items: center;
  }
  .widget_text_center {
      text-align: center;
  }
  .widget_space_btween{
      display: flex;
      justify-content: space-between;
  }
  .widget_form_box h2 {
      font-size: 26px;
      font-weight: 600;
      text-align: start;
      margin: 0;
      padding-bottom: 5px;
      color: var(--heading_color);
  }
  .widget_event_content_wrap{
    display: flex;
    gap: 20px;
    align-items: center;
    margin-bottom: 5px
}
.widget_event_content_wrap span{
    width: 30px;
    height: 30px;
    background: var(--widget_color);
    text-align: center;
    line-height: 25px;
    border-radius: 15px;
    box-shadow: 4px 4px 32px 0px #00000008;
    display:flex;
    justify-content: center;
    align-items: center;
}
.widget_event_content_wrap span svg path{
    fill:#fff;
}
.widget_event_content_wrap p{
    font-size: 12px;
    margin: 0;
    color: var(--sub_heading_color);
}
.widget_event_content_wrap h4{
    font-size: 14px;
    font-weight: 500;
    margin:0;
    padding: 6px 0;
    color: var(--label_Color);
}
.widget_event_content_wrap span svg {
  margin-top: 3px;
}
.prev_detail{
  font-size:16px;
  margin:12px 0px;
}
  .widget_form_box h5 {
      font-size: 16px;
      font-weight: 400;
      line-height: 26px;
      text-align: start;
      margin: 0;
      color: var(--sub_heading_color);
  }
  .order_detail{
    padding-top:10px;
  }
  .widget_ipt_wrap {
      margin-bottom: 15px;
      width: 100%;
  }
  .widget_ipt_wrap .iti{
    width:100%;
  }
  .widget_inp_list_wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 30px;
  }
  .widget_inp_list_wrap>.widget_ipt_wrap {
      flex: 1;
  }
  .widget_ipt_wrap>label {
      margin-bottom: 10px;
      margin-right: 10px;
      display: block;
      color: var(--label_Color);
      font-size: 14px;
      font-weight: 500;
  }
  .widget_ipt_wrap input {
      width: 100%;
      padding: 10px 15px;
      border-radius: 5px;
      border: 1px solid var(--input_border_color);
      font-size: 14px;
  }
  .widget_ipt_wrap select {
      width: 100%;
      padding: 10px 15px;
      border-radius: 5px;
      border: 1px solid var(--input_border_color);
      text-transform: capitalize;
      font-size: 14px;
  }
  .widget_ipt_wrap select:focus-visible {
      border: 1px solid var(--widget_color);
      outline: none !important;
  }
  .widget_ipt_wrap input:focus-visible {
      outline: none !important;
      border: 1px solid var(--widget_color);
  }
  .widget_radio_btn_wrapper {
      column-count: 3;
      column-gap: 35px;
  }
  .widget_radio_btn_wrapper label{
    display:block;
  }
  .widget_radio_wrap{
    display: flex;
    align-items: center;
  }
  .widget_radio_btn_wrapper .widget_radio_wrap_timeslot{
    display: flex;
    align-items: center;
    gap:10px;
    min-width: 0;
    width: 100%;
    margin-bottom: 5px !important;
    background: white;
    padding: 8px;
    font-size: 13px !important;
    text-align: start;
    float: none !important;
    vertical-align: middle;
    text-transform: none;
    border: 1px solid var(--input_border_color) !important;
    border-radius: 4px;
  }
.widget_radio_wrap_timeslot:hover{
  color:var(--widget_color);
  border: 1px solid var(--widget_color) !important;
}
.widget_radio_wrap_timeslot input[type=radio]:checked {
  accent-color: var(--widget_color);
  cursor:pointer;
}
.widget_radio_btn_wrapper .timesolt_active{
  color:var(--widget_color);
  border: 1px solid var(--widget_color) !important;
}
  .widget_radio_wrap input{
    cursor:pointer;
  }
  .widget_radio_wrap>label {
      margin-left: 10px;
      cursor:pointer;
  }
  .widget_radio_wrap input[type=radio]:checked {
      accent-color: var(--widget_color);
      cursor:pointer;
  }
  .widget_btn_wrap{
      display: flex;
      gap: 20px;
      margin-top: 15px;
  }
  .widget_btn_css {
    padding: 10px 20px;
    border-radius: 4px;
    color: var(--btn_color);
    background-color: var(--btn_bg);
    border: none;
    cursor: pointer;
    position:relative;
    font-size: 13px;
  }
  .error {
    color: #f7495f;
    font-size: 12px;
    padding-top: 4px;
}
  .widget_btn_css_back{
    padding: 10px 20px;
    border-radius: 4px;
    color: var(--btn_bg);
    background-color: var(--btn_color);
    border: 1px solid var(--btn_bg);
    cursor: pointer;
    position:relative;
    font-size: 13px;
  }
  .otpContainer_wrap{
    margin-bottom:10px;
  }
  .otpContainer_wrap>label{
    margin-bottom: 10px;
    margin-right: 10px;
    display: block;
    color: var(--label_Color);
    font-size: 14px;
    font-weight: 500;
  }
  .otpContainer_wrap.otp_input_wrap{
    display:flex;
    align-items:center;
  }
  .countdown_css{
    font-size:12px;
    color: var(--sub_heading_color);
    text-decoration: underline;
}
.widget_group_radio{
  margin-bottom: 15px;   
}
  .widget_group_radio>label {
    margin-bottom: 10px;
    margin-right: 10px;
    display: block;
    color: var(--label_Color);
    font-size: 14px;
    font-weight: 500;
}
.widget_thanku_box p{
  font-size: 20px;
  font-weight: 500;
  text-align: start;
   color: var(--widget_color);
}
.otp_error{
  color: #f7495f;
  font-size: 12px;
}
.detail_tag{
  display: flex;
  gap: 12px;
  font-size: 16px;
   margin-bottom: 5px;
   align-items:baseline;
}
.detail_tag div{
  color:var(--sub_heading_color);
  font-size:14px;
}
.table_conatiner{
  max-width: 100%;
  overflow-x: auto;
  margin:20px 0px;
}
.table{
  min-width: 600px; 
width: 100%;
border-collapse: collapse;
  border: 1px solid #e5e1e1;
}
.table thead{
  border: 1px solid #e5e1e1;
}
.table tr{
  border: 1px solid #e5e1e1;
}
.table th ,td{
  padding: 8px 0px;
  text-align: center;
}
.skeleton {
  animation: skeleton-loading 1s linear infinite alternate;
  border-radius: 5px;
}
@keyframes skeleton-loading {
  0% {
    background-color: hsl(200, 20%, 94%);
  }
  100% {
    background-color: hsl(180, 100%, 100%);
  }
}
.skeleton-text {
  width: 100%;
  height: 1rem;
  margin-bottom: 0.5rem;
}
.skeleton-text__body {
  width: 75%;
}
.skeleton-table{
  width: 100%;
  height: 6rem;
}
.widget_available{
  padding: 3px 8px;
    border: 1px solid;
    border-radius: 5px;
    font-size: 11px;
    color: #fff;
    background-color: green;
    max-width: 85px;
    width: 100%;
    text-align: center;
}
.button-loading::after {
  content: "";
  position: absolute;
  width: 16px;
  height: 16px;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  border: 4px solid transparent;
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: button-loading-spinner 1s ease infinite;
}
@keyframes button-loading-spinner {
  from {
    transform: rotate(0turn);
  }
  to {
    transform: rotate(1turn);
  }
}
  @media screen and (max-width: 768px) {
      .widget_inp_list_wrap {
          flex-direction: column;
          gap: 3px;
      }
      .widget_form_box {
        max-width: 450px;
        width: 100%;
 }
  }
  
@media screen and (max-width: 450px) {
  .widget_form_box {
    max-width: none;
    width: 100%;
    padding:16px;
}
.widget_radio_btn_wrapper{
  column-count: 2;
column-gap: 25px;
}
.widget_radio_btn_wrapper .widget_radio_wrap_timeslot{
     gap:5px;    
  padding: 5px;
}

  }
  `;
    return template1;
  }
  if (template == 'template2') {
    var template2 = `@charset "UTF-8";@import url(https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap);
    body{
      font-family:Poppins,sans-serif;
    }
    :root {
      --widget_color: #DD1047;
      --label_Color: #222222;
      --input_border_color: #F0F0F0;
      --heading_color: #DD1047;
      --sub_heading_color: #797979;
      --btn_color: #fff;
      --btn_bg: #DD1047;
  }
  .rtl{
    direction: rtl;
  }
  button:focus-visible{
    outline:none;
  }
  button:focus{
    outline:none;
  }
  .otp-input {
    width: 30px;
    height: 30px;
    font-size: 20px;
    text-align: center;
    margin-right: 6px;
    border-radius:5px;
    border-color: var(--btn_bg);
  }
  .widget_form_box {
      max-width: 812px;
      width: 100%;
      background: #fff;
      padding: 40px;
      border-radius: 10px;
      box-shadow: 4px 4px 32px 0px #00000008;
      margin:40px auto;
  }
  .widget_heading_wrapper{
      display: flex;
      gap: 22px;
  }
  .widget_calender_design{
      width: 82px;
      text-align: center;
      height: 70px;
      border-radius: 7px;
      overflow: hidden;
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  }
  .widget_event_detail_wrapper{
    margin-bottom:10px;
  }
  .widget_event_detail_wrapper h4{
    font-size:16px;
    margin: 25px 0;
  }
  .widget_calender_design div:first-child{
      text-transform: uppercase;
      border-bottom: 1px solid;
      background: var(--widget_color);
      color: #fff;
      font-size: 14px;
      font-weight: 700;
      padding: 6px
  }
  .widget_calender_design div:last-child{
      padding: 7px;
      font-size: 18px;
      color: #000;
  }
  .prev_detail{
    font-size:16px;
    margin:12px 0px;
  }
  .widget_text_left {
    display: flex;
    justify-content: flex-end;
      margin-bottom: 20px;
  }
  .widget_ipt_checkbox{
    margin-bottom: 15px;
}
.widget_ipt_checkbox input{
   margin-right: 10px;
}
.widget_ipt_checkbox input[type=checkbox]:checked {
    accent-color: var(--widget_color);
}
  .widget_text_center {
      text-align: center;
  }
  .widget_btn_box_Wrapper{
      display: flex;
      justify-content: end;
      gap: 15px;
  }
  .widget_form_box h2 {
      font-size: 26px;
      font-weight: 600;
      text-align: start;
      margin: 0;
      padding-bottom: 5px;
      color: var(--heading_color);
  }
  .widget_form_box h5 {
      font-size: 16px;
      font-weight: 400;
      line-height: 26px;
      text-align: start;
      margin: 0;
      color: var(--sub_heading_color);
  }
  .widget_ipt_wrap {
      margin-bottom: 15px;
      width: 100%;
  }
  .widget_ipt_wrap .iti{
    width:100%;
  }
  .widget_ipt_wrap>label {
      margin-bottom: 10px;
      margin-right: 10px;
      display: block;
      color: var(--label_Color);
      font-size: 14px;
      font-weight: 500;
  }
  .widget_ipt_wrap input {
      width: 100%;
      padding: 10px 15px;
      border-radius: 5px;
      font-size: 14px;
      border: 1px solid var(--input_border_color);
  }
  .widget_ipt_wrap select {
      width: 100%;
      padding: 10px 15px;
      border-radius: 5px;
      border: 1px solid var(--input_border_color);
      text-transform: capitalize;
      font-size: 14px;
  }
  .widget_ipt_wrap select:focus-visible {
      border: 1px solid var(--widget_color);
      outline: none !important;
  }
  .widget_ipt_wrap input:focus-visible {
      outline: none !important;
      border: 1px solid var(--widget_color);
  }
  .widget_radio_btn_wrapper {
      column-count: 3;
      column-gap: 35px;
  }
  .widget_radio_btn_wrapper label{
    display:block;
  }
  .widget_radio_wrap{
    display: flex;
    align-items: center;
  }
  .widget_radio_btn_wrapper .widget_radio_wrap_timeslot{
    display: flex;
    align-items: center;
    gap:10px;
    min-width: 0;
    width: 100%;
    margin-bottom: 5px !important;
    background: white;
    padding: 8px;
    font-size: 13px !important;
    text-align: start;
    float: none !important;
    vertical-align: middle;
    text-transform: none;
    border: 1px solid var(--input_border_color) !important;
    border-radius: 4px;
  }
.widget_radio_wrap_timeslot:hover{
  color:var(--widget_color);
  border: 1px solid var(--widget_color) !important;
}
.widget_radio_wrap_timeslot input[type=radio]:checked {
  accent-color: var(--widget_color);
  cursor:pointer;
}
.order_detail{
  padding-top:10px;
}
.widget_radio_btn_wrapper .timesolt_active{
  color:var(--widget_color);
  border: 1px solid var(--widget_color) !important;
}
  .widget_radio_wrap input{
    cursor:pointer;
  }
  .widget_radio_wrap>label {
      margin-left: 10px;
      cursor:pointer;
  }
  .widget_radio_wrap input[type=radio]:checked {
      accent-color: var(--widget_color);
      cursor:pointer;
  }
  .error {
    color: #f7495f;
    font-size: 12px;
    padding-top: 4px;
}
  .widget_btn_css {
    padding: 10px 20px;
    border-radius: 4px;
    color: var(--btn_color);
    background-color: var(--btn_bg);
    border: none;
    cursor: pointer;
    position:relative;
    font-size: 13px;
  }
  .widget_email_field_wrap{
    display:flex;
    gap: 10px;
    align-items: center;
  }
  .widget_event_content_wrap{
      display: flex;
      gap: 20px;
      align-items: center;  
      margin-bottom: 5px;
  }
  .widget_event_content_wrap span{
      width: 30px;
      height: 30px;
      background: var(--widget_color);
      text-align: center;
      line-height: 25px;
      border-radius: 15px;
      box-shadow: 4px 4px 32px 0px #00000008;
      display:flex;
    justify-content: center;
    align-items: center;
  }
  .widget_event_content_wrap span svg {
    margin-top:3px;
  }  
  .widget_event_content_wrap span svg path{
      fill:#fff;
  }
  .widget_event_content_wrap p{
      font-size: 12px;
      margin: 0;
      color: var(--sub_heading_color);
  }
  .widget_event_content_wrap h4{
      font-size: 14px;
      font-weight: 500;
      margin:0;
      padding: 6px 0;
      color: var(--label_Color);
  }
  .widget_event_content_wrap span svg {
    margin-top: 3px;
}
  .widget_ticket_list_wrap h4{
      border-bottom: 1px solid #e5e1e1;
      padding: 11px 0px;
      font-size: 16px;
      margin: 10px 0;
  }
  .widget_ticket_box{
      border-bottom: 1px solid #e5e1e1;
      margin-bottom: 15px;
      font-size: 14px;
    color: var(--sub_heading_color);
  }
  .widget_ticket_box .widget_ticket_upper_part{
      display: flex;
      justify-content: space-between;
      align-items: center;
  }
  .widget_ticket_box .widget_ticket_upper_part_desc{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .widget_ticket_name_wrap{
      display: flex;
      gap: 15px;
      align-items: center;
  }
  .widget_ticket_name_wrap h5{
  padding-bottom: 0;
  color: var(--widget_color);
    font-weight: 500;
    font-size: 18px;
  }
  .widget_upper_right_box{
      display:flex ;
      gap: 15px;
  }
  .widget_ticket_count{
    display: flex;
    align-items: center;
  }
  .widget_ticket_count span{
      display: block;
  }
  .widget_ticket_count span:first-child{
      width: 30px;
      height: 30px;
      border: 1px solid;
      text-align: center;
      border-radius: 15px;
      font-size: 25px;
      cursor: pointer;
      transition: all .4s;
      display: flex;
    justify-content: center;
    align-items: center;
  }
  .widget_ticket_count span:first-child:hover{
      border-color: var(--btn_bg);
      background-color: var(--btn_bg);
      color: var(--btn_color);
  }
  .widget_ticket_count span:last-child{
      width: 30px;
      height: 30px;
      border: 1px solid;
      text-align: center;
      border-radius: 15px;
      font-size: 25px;
      cursor: pointer;
      display: flex;
    justify-content: center;
    align-items: center;
  }
  .widget_ticket_count span:last-child:hover{
      border-color: var(--btn_bg);
      background-color: var(--btn_bg);
      color: var(--btn_color);
  }
  .widget_ticket_count span:nth-child(2) {
      width: 40px;
      text-align: center;
      font-size: 16px;
  }
  .widget_ticket_box p{
      margin: 0;
      padding: 10px 0;
      color: var(--sub_heading_color);
  }
  .widget_btn_css_back{
    padding: 10px 20px;
    border-radius: 4px;
    color: var(--btn_bg);
    background-color: var(--btn_color);
    border: 1px solid var(--btn_bg);
    cursor: pointer;
    position:relative;
    font-size: 13px;
  }
  .otpContainer_wrap{
    margin-bottom:10px;
  }
  .otpContainer_wrap>label{
    margin-bottom: 10px;
    margin-right: 10px;
    display: block;
    color: var(--label_Color);
    font-size: 14px;
    font-weight: 500;
  }
  .otpContainer_wrap .otp_input_wrap{
    display:flex;
    align-items:center;
  }
  .countdown_css{
    font-size:12px;
    color: var(--sub_heading_color);
    text-decoration: underline;
}
.otp_error{
  color: #f7495f;
  font-size: 12px;
}
  .widget_thanku_box{
      text-align: center;
  }
  .widget_group_radio{
    margin-bottom: 15px;   
  }
    .widget_group_radio>label {
      margin-bottom: 10px;
      margin-right: 10px;
      display: block;
      color: var(--label_Color);
      font-size: 14px;
      font-weight: 500;
  }
  .detail_tag{
    display: flex;
    gap: 12px;
    font-size: 16px;
    margin-bottom: 5px;
    align-items:baseline;
  }
  .detail_tag div{
    color:var(--sub_heading_color);
    font-size:14px;
  }
.table_conatiner{
    max-width: 100%;
    overflow-x: auto;
    margin: 20px 0px
}
.table{
    min-width: 600px; 
  width: 100%;
  border-collapse: collapse;
    border: 1px solid #e5e1e1;
}
.table thead{
    border: 1px solid #e5e1e1;
}
.table tr{
    border: 1px solid #e5e1e1;
}
.table th ,td{
    padding: 8px 0px;
    text-align: center;
}
  .widget_thanku_box p{
      font-size: 20px;
      font-weight: 500;
      text-align: start;
       color: var(--widget_color);
  }
  .skeleton {
    animation: skeleton-loading 1s linear infinite alternate;
    border-radius: 5px;
  }
  @keyframes skeleton-loading {
    0% {
      background-color: hsl(200, 20%, 94%);
    }
    100% {
      background-color: hsl(180, 100%, 100%);
    }
  }
  .skeleton-text {
    width: 100%;
    height: 1rem;
    margin-bottom: 0.5rem;
  }
  .skeleton-text__body {
    width: 75%;
  }
  .skeleton-table{
    width: 100%;
    height: 6rem;
  }
  .widget_available{
    padding: 3px 8px;
      border: 1px solid;
      border-radius: 5px;
      font-size: 11px;
      color: #fff;
      background-color: green;
      max-width: 85px;
    width: 100%;
    text-align: center;
  }
  .button-loading::after {
    content: "";
    position: absolute;
    width: 16px;
    height: 16px;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    border: 4px solid transparent;
    border-top-color: #ffffff;
    border-radius: 50%;
    animation: button-loading-spinner 1s ease infinite;
  }
  @keyframes button-loading-spinner {
    from {
      transform: rotate(0turn);
    }
    to {
      transform: rotate(1turn);
    }
  }
  @media screen and (max-width: 768px) {
    .widget_inp_list_wrap {
        flex-direction: column;
        gap: 3px;
    }
  
      .widget_form_box {
         max-width: 450px;
         width: 100%;
  }
  .widget_ticket_count span:first-child{
    width: 25px;
    height: 25px;
    font-size: 18px;
}
.widget_ticket_count span:last-child{
  width: 25px;
    height: 25px;
    font-size: 18px;
}

.widget_ticket_count span:nth-child(2) {
  width: 25px;
}
.widget_ticket_box .widget_ticket_upper_part_desc{
  flex-direction: column-reverse;
    justify-content: start;
    align-items: flex-start;
}


}

@media screen and (max-width: 450px) {
  .widget_form_box {
    max-width:none;
    width: 100%;
    padding:16px;
}

.widget_radio_btn_wrapper{
  column-count: 2;
column-gap: 25px;
}
.widget_radio_btn_wrapper .widget_radio_wrap_timeslot{
     gap:5px;    
  padding: 5px;
}

}

  `;
    return template2;
  }
  if (template == 'template3') {
    var template3 = `@charset "UTF-8";@import url(https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap);
    body{
      font-family:Poppins,sans-serif;
    }
    :root {
      --widget_color: #DD1047;
      --label_Color: #222222;
      --input_border_color: #F0F0F0;
      --heading_color: #DD1047;
      --sub_heading_color: #797979;
      --btn_color: #fff;
      --btn_bg: #DD1047;
  }
  .rtl{
    direction: rtl;
  }
  button:focus-visible{
    outline:none;
  }
  button:focus{
    outline:none;
  }
  .otp-input {
    width: 30px;
    height: 30px;
    font-size: 20px;
    text-align: center;
    margin-right: 6px;
    border-radius:5px;
    border-color: var(--btn_bg);
  }
  .widget_form_box {
      max-width: 812px;
      width: 100%;
      background: #fff;
      padding: 40px;
      border-radius: 10px;
      box-shadow: 4px 4px 32px 0px #00000008;
      margin:40px auto;
  }
  .widget_heading_wrapper{
      display: flex;
      gap: 22px;
  }
  .widget_email_field_wrap{
    display:flex;
    gap: 10px;
    align-items: center;
  }
  .widget_group_radio{
    margin-bottom: 15px;   
  }
    .widget_group_radio>label {
      margin-bottom: 10px;
      margin-right: 10px;
      display: block;
      color: var(--label_Color);
      font-size: 14px;
      font-weight: 500;
  }
  .widget_calender_design{
      width: 82px;
      text-align: center;
      height: 70px;
      border-radius: 7px;
      overflow: hidden;
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  }
  .widget_ipt_checkbox{
    margin-bottom: 15px;
}
.widget_ipt_checkbox input{
   margin-right: 10px;
}
.widget_ipt_checkbox input[type=checkbox]:checked {
    accent-color: var(--widget_color);
}
.error {
  color: #f7495f;
  font-size: 12px;
  padding-top: 4px;
}
  .widget_calender_design div:first-child{
      text-transform: uppercase;
      border-bottom: 1px solid;
      background: var(--widget_color);
      color: #fff;
      font-size: 14px;
      font-weight: 700;
      padding: 6px
  }
  .widget_event_detail_wrapper{
    margin-bottom:10px;
  }
  .widget_event_detail_wrapper h4{
    font-size:16px;
    margin: 25px 0;
  }
  .widget_calender_design div:last-child{
      padding: 7px;
      font-size: 18px;
      color: #000;
  }
  .prev_detail{
    font-size:16px;
    margin:12px 0px;
  }
  .widget_text_left {
    display: flex;
    justify-content: flex-end;
      margin-bottom: 20px;
  }
  .widget_text_center {
      text-align: center;
  }
  .widget_btn_box_Wrapper{
      display: flex;
      justify-content: end;
      gap: 15px;
  }
  .widget_form_box h2 {
      font-size: 26px;
      font-weight: 600;
      margin: 0;
      padding-bottom: 5px;
      color: var(--heading_color);
  }
  .widget_form_box h5 {
      font-size: 16px;
      font-weight: 400;
      line-height: 26px;
      text-align: start;
      margin: 0;
      color: var(--sub_heading_color);
  }
  .widget_inp_list_wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 30px;
  }
  .widget_inp_list_wrap>.widget_ipt_wrap {
      flex: 1;
  }
  .widget_ipt_wrap {
      margin-bottom: 15px;
      width: 100%;
  }
  .widget_ipt_wrap .iti{
    width:100%;
  }
  .widget_ipt_wrap>label {
      margin-bottom: 10px;
      margin-right: 10px;
      display: block;
      color: var(--label_Color);
      font-size: 14px;
      font-weight: 500;
  }
  .order_detail{
    padding-top:10px;
  }
  .widget_ipt_wrap input {
      width: 100%;
      padding: 10px 15px;
      font-size: 14px;
      border-radius: 5px;
      border: 1px solid var(--input_border_color);
  }
  .widget_ipt_wrap select {
      width: 100%;
      padding: 10px 15px;
      border-radius: 5px;
      border: 1px solid var(--input_border_color);
      text-transform: capitalize;
      font-size: 14px;
  }
  .widget_ipt_wrap select:focus-visible {
      border: 1px solid var(--widget_color);
      outline: none !important;
  }
  .widget_ipt_wrap input:focus-visible {
      outline: none !important;
      border: 1px solid var(--widget_color);
  }
  .widget_radio_btn_wrapper {
      column-count: 3;
      column-gap: 35px;
  }
  .widget_radio_btn_wrapper label{
    display:block;
  }
  .widget_radio_btn_wrapper .widget_radio_wrap_timeslot{
    display: flex;
    align-items: center;
    gap:10px;
    min-width: 0;
    width: 100%;
    margin-bottom: 5px !important;
    background: white;
    padding: 8px;
    font-size: 13px !important;
    text-align: start;
    float: none !important;
    vertical-align: middle;
    text-transform: none;
    border: 1px solid var(--input_border_color) !important;
    border-radius: 4px;
  }
.widget_radio_wrap_timeslot:hover{
  color:var(--widget_color);
  border: 1px solid var(--widget_color) !important;
}
.widget_radio_wrap_timeslot input[type=radio]:checked {
  accent-color: var(--widget_color);
  cursor:pointer;
}
.widget_radio_btn_wrapper .timesolt_active{
  color:var(--widget_color);
  border: 1px solid var(--widget_color) !important;
}
  .widget_radio_wrap{
    display: flex;
    align-items: center;
  }
  .widget_radio_wrap input{
    cursor:pointer;
  }
  .widget_radio_wrap>label {
      margin-left: 10px;
      cursor:pointer;
  }
  .widget_radio_wrap input[type=radio]:checked {
      accent-color: var(--widget_color);
      cursor:pointer;
  }
  .widget_btn_css {
    padding: 10px 20px;
    border-radius: 4px;
    color: var(--btn_color);
    background-color: var(--btn_bg);
    border: none;
    cursor: pointer;
    position:relative;
    font-size: 13px;
  }
  .widget_event_content_wrap{
      display: flex;
      gap: 20px;
      align-items: center;
      margin-bottom: 5px
  }
  .widget_event_content_wrap span{
      width: 30px;
      height: 30px;
      background: var(--widget_color);
      text-align: center;
      line-height: 25px;
      border-radius: 15px;
      box-shadow: 4px 4px 32px 0px #00000008;
      display:flex;
    justify-content: center;
    align-items: center;
  }
  .widget_event_content_wrap span svg path{
      fill:#fff;
  }
  .widget_event_content_wrap p{
      font-size: 12px;
      margin: 0;
      color: var(--sub_heading_color);
  }
  .widget_event_content_wrap h4{
      font-size: 14px;
      font-weight: 500;
      margin:0;
      padding: 6px 0;
      color: var(--label_Color);
  }
  .widget_event_content_wrap span svg {
    margin-top: 3px;
}
  .widget_ticket_list_wrap h4{
      border-bottom: 1px solid #e5e1e1;
      padding: 11px 0px;
      font-size: 16px;
      margin: 10px 0;
  }
  .widget_ticket_box{
      border-bottom: 1px solid #e5e1e1;
      margin-bottom: 15px;
      font-size: 14px;
    color: var(--sub_heading_color);
  }
  .widget_ticket_box .widget_ticket_upper_part{
      display: flex;
      justify-content: space-between;
      align-items: center;
  }
  
  .widget_ticket_box .widget_ticket_upper_part_desc{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
  .widget_ticket_name_wrap .widget_name_div{
      display: flex;
      gap: 15px;
      align-items: center;
  }
  .widget_ticket_name_wrap h5{
  padding-bottom: 0;  
  color: var(--widget_color);
  font-weight: 500;
  font-size: 18px;
}
  .widget_upper_right_box{
      display:flex ;
      gap: 15px;
  }
  .widget_ticket_count{
    display: flex;
    align-items: center;
  }
  .widget_ticket_count span{
      display: block;
  }
  .widget_ticket_count span:first-child{
      width: 30px;
      height: 30px;
      border: 1px solid;
      text-align: center;
      border-radius: 15px;
      font-size: 25px;
      cursor: pointer;
      transition: all .4s;
      display: flex;
    justify-content: center;
    align-items: center;
  }
  .widget_ticket_count span:first-child:hover{
      border-color: var(--btn_bg);
      background-color: var(--btn_bg);
      color: var(--btn_color);
  }
  .widget_ticket_count span:last-child{
      width: 30px;
      height: 30px;
      border: 1px solid;
      text-align: center;
      border-radius: 15px;
      font-size: 25px;
      cursor: pointer;
      display: flex;
    justify-content: center;
    align-items: center;
  }
  .widget_ticket_count span:last-child:hover{
      border-color: var(--btn_bg);
      background-color: var(--btn_bg);
      color: var(--btn_color);
  }
  .widget_ticket_count span:nth-child(2) {
      width: 40px;
      text-align: center;
      font-size: 16px;
  }
  .widget_ticket_box p{
      margin: 0;
      padding: 10px 0;
      color: var(--sub_heading_color);
  }
  .widget_btn_css_back{
    padding: 10px 20px;
    border-radius: 4px;
    color: var(--btn_bg);
    background-color: var(--btn_color);
    border: 1px solid var(--btn_bg);
    cursor: pointer;
    position:relative;
    font-size: 13px;
  }
  .widget_thanku_box{
      text-align: center;
  }
  .widget_thanku_box p{
    font-size: 20px;
    font-weight: 500;
    text-align: start;
     color: var(--widget_color);
  }
  .otpContainer_wrap{
    margin-bottom:10px;
  }
  .otpContainer_wrap>label{
    margin-bottom: 10px;
    margin-right: 10px;
    display: block;
    color: var(--label_Color);
    font-size: 14px;
    font-weight: 500;
  }
  .otpContainer_wrap .otp_input_wrap{
    display:flex;
    align-items:center;
  }
  .countdown_css{
    font-size:12px;
    color: var(--sub_heading_color);
    text-decoration: underline;
}
.otp_error{
  color: #f7495f;
  font-size: 12px;
}
.detail_tag{
  display: flex;
  gap: 12px;
  font-size: 16px;
  margin-bottom: 5px;
  align-items:baseline;
}
.detail_tag div{
  color:var(--sub_heading_color);
  font-size:14px;
}
.table_conatiner{
  max-width: 100%;
  overflow-x: auto;
  margin: 20px 0px
}
.table{
  min-width: 600px; 
width: 100%;
border-collapse: collapse;
  border: 1px solid #e5e1e1;
}
.table thead{
  border: 1px solid #e5e1e1;
}
.table tr{
  border: 1px solid #e5e1e1;
}
.table th ,td{
  padding: 8px 0px;
  text-align: center;
}
.skeleton {
  animation: skeleton-loading 1s linear infinite alternate;
  border-radius: 5px;
}
.button-loading::after {
  content: "";
  position: absolute;
  width: 16px;
  height: 16px;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  border: 4px solid transparent;
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: button-loading-spinner 1s ease infinite;
}
@keyframes button-loading-spinner {
  from {
    transform: rotate(0turn);
  }
  to {
    transform: rotate(1turn);
  }
}
@keyframes skeleton-loading {
  0% {
    background-color: hsl(200, 20%, 94%);
  }
  100% {
    background-color: hsl(180, 100%, 100%);
  }
}
.skeleton-text {
  width: 100%;
  height: 1rem;
  margin-bottom: 0.5rem;
}
.skeleton-text__body {
  width: 75%;
}
.skeleton-table{
  width: 100%;
  height: 6rem;
}
.widget_available{
  padding: 3px 8px;
    border: 1px solid;
    border-radius: 5px;
    font-size: 11px;
    color: #fff;
    background-color: green;
    max-width: 85px;
    width: 100%;
    text-align: center;
}
  @media screen and (max-width: 768px) {
      .widget_inp_list_wrap {
          flex-direction: column;
          gap: 3px;
      }
    
        .widget_form_box {
           max-width: 450px;
           width: 100%;
    }
    .widget_ticket_count span:first-child{
      width: 25px;
      height: 25px;
      font-size: 18px;
  }
  .widget_ticket_count span:last-child{
    width: 25px;
      height: 25px;
      font-size: 18px;
  }
  
  .widget_ticket_count span:nth-child(2) {
    width: 25px;
  }
  .widget_ticket_box .widget_ticket_upper_part_desc{
    flex-direction: column-reverse;
      justify-content: start;
      align-items: flex-start;
  }
  }
  @media screen and (max-width: 450px) {
    .widget_form_box {
      max-width:none;
      width: 100%;
      padding:16px;
  }
  .widget_radio_btn_wrapper{
    column-count: 2;
column-gap: 25px;
  }
  .widget_radio_btn_wrapper .widget_radio_wrap_timeslot{
       gap:5px;    
    padding: 5px;
  }
}
  `;
    return template3;
  }
  if (template == 'template4') {
    var template4 = `@import url(https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap);
    :root {
        --widget_color: #DD1047;
        --label_Color: #222222;
        --input_border_color: #F0F0F0;
        --heading_color: #DD1047;
        --sub_heading_color: #797979;
        --btn_color: #fff;
        --btn_bg: #DD1047;
    }
    body{
        font-family:Poppins,sans-serif;
    }
    button:focus-visible{
      outline:none;
    }
    .rtl{
      direction: rtl;
    }
    button:focus{
      outline:none;
    }
    .otp-input {
      width: 30px;
      height: 30px;
      font-size: 20px;
      text-align: center;
      margin-right: 6px;
      border-radius:5px;
      border-color: var(--btn_bg);
    }
    .widget_form_box {
         margin: 50px auto;
        max-width: 812px;
        width: 100%;
        background: #fff;
        padding: 40px;
        border-radius: 10px;
        box-shadow: 4px 4px 32px 0px #00000008;
        margin:40px auto;
    }
    .widget_heading_wrapper{
        display: flex;
        gap: 22px;
    }
    .widget_text_left {
      display: flex;
      justify-content: flex-end;
        margin-bottom: 20px;
    }
    .widget_email_field_wrap{
      display:flex;
      gap: 10px;
      align-items: center;
    }
    .widget_text_center {
        text-align: center;
    }
    .widget_btn_box_Wrapper{
        display: flex;
        justify-content: flex-end;
        gap: 15px;
    }
    .widget_event_detail_wrapper{
      font-size:16px;
      margin-bottom:10px;
      margin-top:15px;
    }
    .widget_form_box h2 {
        font-size: 26px;
        font-weight: 600;
        text-align: start;
        margin: 0;
        padding-bottom: 5px;
        color: var(--heading_color);
    }
    .widget_ticket_count{
      display: flex;
      align-items: center;
    }
    .widget_ticket_count span{
        display: block;
    }
    .widget_ticket_count span:first-child{
        width: 30px;
        height: 30px;
        border: 1px solid;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 15px;
        font-size: 25px;
        cursor: pointer;
        transition: all .4s;
    }
    .widget_ticket_count span:first-child:hover{
        border-color: var(--btn_bg);
        background-color: var(--btn_bg);
        color: var(--btn_color);
    }
    .prev_detail{
      font-size:16px;
      margin:12px 0px;
    }
    .widget_ticket_count span:last-child{
        width: 30px;
        height: 30px;
        border: 1px solid;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 15px;
        font-size: 25px;
        cursor: pointer;
    }
    .widget_ticket_count span:last-child:hover{
        border-color: var(--btn_bg);
        background-color: var(--btn_bg);
        color: var(--btn_color);
    }
    .widget_ticket_count span:nth-child(2) {
        width: 40px;
        text-align: center;
        font-size: 16px;
    }
    .widget_form_box h5 {
        font-size: 16px;
        font-weight: 400;
        line-height: 26px;
        text-align: start;
        margin: 0;
        color: var(--sub_heading_color);
    }
    .widget_inp_list_wrap {
        display: flex;
        flex-wrap: wrap;
        gap: 30px;
    }
    .widget_inp_list_wrap>.widget_ipt_wrap {
        flex: 1;
    }
    .widget_ipt_wrap {
        margin-bottom: 15px;
        width: 100%;
    }
    .widget_ipt_wrap .iti{
      width:100%;
    }
    .widget_ipt_wrap>label {
        margin-bottom: 10px;
        margin-right: 10px;
        display: block;
        color: var(--label_Color);
        font-size: 14px;
        font-weight: 500;
    }
    .widget_group_radio{
      margin-bottom: 15px;   
    }
      .widget_group_radio>label {
        margin-bottom: 10px;
        margin-right: 10px;
        display: block;
        color: var(--label_Color);
        font-size: 14px;
        font-weight: 500;
    }
    .widget_ipt_wrap input {
        width: 100%;
        padding: 10px 15px;
        border-radius: 5px;
        border: 1px solid var(--input_border_color);
      font-size: 14px;
    }
    .widget_ipt_wrap select {
        width: 100%;
        padding: 10px 15px;
        border-radius: 5px;
        border: 1px solid var(--input_border_color);
        text-transform: capitalize;
      font-size: 14px;
    }
    .widget_ipt_checkbox{
        margin-bottom: 15px;
    }
    .widget_ipt_checkbox input{
       margin-right: 10px;
    }
    .widget_ipt_checkbox input[type=checkbox]:checked {
        accent-color: var(--widget_color);
    }
    .widget_ipt_wrap select:focus-visible {
        border: 1px solid var(--widget_color);
        outline: none !important;
    }
    .widget_ipt_wrap input:focus-visible {
        outline: none !important;
        border: 1px solid var(--widget_color);
    }
    .widget_radio_btn_wrapper {
        column-count: 3;
        column-gap: 35px;
    }
    .widget_radio_btn_wrapper label{
      display:block;
    }
    .widget_radio_btn_wrapper .widget_radio_wrap_timeslot{
      display: flex;
      align-items: center;
      gap:10px;
      min-width: 0;
      width: 100%;
      margin-bottom: 5px !important;
      background: white;
      padding: 8px;
      font-size: 13px !important;
      text-align: start;
      float: none !important;
      vertical-align: middle;
      text-transform: none;
      border: 1px solid var(--input_border_color) !important;
      border-radius: 4px;
    }
  .widget_radio_wrap_timeslot:hover{
    color:var(--widget_color);
    border: 1px solid var(--widget_color) !important;
  }
  .widget_radio_wrap_timeslot input[type=radio]:checked {
    accent-color: var(--widget_color);
    cursor:pointer;
  }
  .widget_radio_btn_wrapper .timesolt_active{
    color:var(--widget_color);
    border: 1px solid var(--widget_color) !important;
  }
    .widget_radio_wrap{
      display: flex;
      align-items: center;
    }
    .widget_radio_wrap>label {
        margin-left: 10px;
        cursor:pointer;
    }
    .widget_radio_wrap input{
      cursor:pointer;
    }
    .widget_radio_wrap input[type=radio]:checked {
        accent-color: var(--widget_color);
        cursor:pointer;
    }
    .widget_btn_css {
        padding: 10px 20px;
        border-radius: 4px;
        color: var(--btn_color);
        background-color: var(--btn_bg);
        border: none;
        cursor: pointer;
      position:relative;
      font-size: 13px;
    }
    .order_detail{
      padding-top:10px;
    }
    .widget_radio_wrap{
      display: flex;
      align-items: center;
    }
    .widget_event_content_wrap{
        display: flex;
        gap: 20px;
        align-items: center;
        margin-bottom: 5px
    }
    .widget_event_content_wrap span{
        width: 30px;
        height: 30px;
        background: var(--widget_color);
        text-align: center;
        line-height: 25px;
        border-radius: 15px;
        box-shadow: 4px 4px 32px 0px #00000008;
        display:flex;
      justify-content: center;
      align-items: center;
    }
    .widget_event_content_wrap span svg path{
        fill:#fff;
    }
    .widget_event_content_wrap p{
        font-size: 12px;
        margin: 0;
        color: var(--sub_heading_color);
    }
    .widget_event_content_wrap h4{
        font-size: 14px;
        font-weight: 500;
        margin:0;
        padding: 6px 0;
        color: var(--label_Color);
    }
    .widget_ticket_list_wrap h4{
        font-size: 14px;
        font-weight: 600;
      margin: 10px 0;
    }
    .widget_btn_css_back{
      padding: 10px 20px;
      border-radius: 4px;
      color: var(--btn_bg);
      background-color: var(--btn_color);
      border: 1px solid var(--btn_bg);
      cursor: pointer;
      position:relative;
      font-size: 13px;
    }
    .widget_img_display{
        display: none;
    }
    .widget_thanku_box{
        text-align: center;
    }
    .widget_thanku_box p{
      font-size: 20px;
      font-weight: 500;
      text-align: start;
       color: var(--widget_color);
    }
    .widget_room_type_wrapper{
        display: grid;
        grid-template-columns:1fr 2fr 1fr;
        border: 1px solid #dfe0e4;
        border-radius: 5px;
        margin-bottom: 10px;
    }
    .widget_room_type_wrapper .widget_room_image_section{
       position: relative;
       width: 200px;
        height: 165px;
    }
    .widget_room_type_wrapper .widget_room_image_section  img{
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .widget_room_image_section .widget_slider_left{
        position: absolute;
        top: 50%;
        left: 3%;
        transform: translate(0%,-50%);
        color: #fff;
        background-color: #222222;
        border-radius: 50px;
        width: 28px;
        height: 28px;
        cursor: pointer;
        border:0;
    }
    .widget_room_image_section .widget_slider_right{
        position: absolute;
        top: 50%;
        right: 3%;
        transform: translate(0%,-50%);
        color: #fff;
        background-color: #222222;
        border-radius: 50px;
        width: 28px;
        height: 28px;
        cursor: pointer;
        border:0;
    }
    .widget_room_type_wrapper .widget_room_detail_right{
      padding: 12px;
    }
    .widget_room_name_box {
        display: flex;
        gap: 10px;
        align-items: center;
    }
    .widget_room_name_box .widget_room_available{
        padding: 3px 8px;
        border: 1px solid;
        border-radius: 5px;
        font-size: 11px;
        color: #fff;
        background-color: green;
    }
    .widget_room_type_wrapper .widget_room_detail_right h3{
        margin: 0;
        font-size: 16px;
        color: var(--widget_color);
    }
    .widget_room_pricing{
        margin: 0 auto;
        padding-top: 20px;
    }
    .widget_room_pricing .widget_room_price{
        color: var(--widget_color);
        font-size: 16px;
        font-weight: 600;
        text-align: center;
    }
    .widget_event_content_wrap span svg {
      margin-top: 3px;
    }
    .widget_room_detail_right p{
        font-size: 14px;
        color: var(--sub_heading_color);
    }
    .otpContainer_wrap{
      margin-bottom:10px;
    }
    .otpContainer_wrap>label{
      margin-bottom: 10px;
      margin-right: 10px;
      display: block;
      color: var(--label_Color);
      font-size: 14px;
      font-weight: 500;
    }
    .otpContainer_wrap .otp_input_wrap{
      display:flex;
      align-items:center;
    }
    .error {
        color: #f7495f;
        font-size: 12px;
        padding-left: 12px;
        padding-top: 4px;
    }
    .countdown_css{
        font-size:12px;
        color: var(--sub_heading_color);
        text-decoration: underline;
    }
    .otp_error{
      color: #f7495f;
      font-size: 12px;
    }
    .d-flex{
      display:flex;
      align-items: center;
       gap: 10px;
    }
    .d-flex h4{
      padding:0px;
    }
    .detail_tag{
      display: flex;
      gap: 12px;
      font-size: 16px;
      margin-bottom: 5px;
      align-items:baseline;
    }
    .detail_tag div{
      color:var(--sub_heading_color);
      font-size:14px;
    }
  .table_conatiner{
      max-width: 100%;
      overflow-x: auto;
      margin: 20px 0;
  }
  .table{
      min-width: 600px;
    width: 100%;
    border-collapse: collapse;
      border: 1px solid #e5e1e1;
  }
  .table thead{
      border: 1px solid #e5e1e1;
  }
  .table tr{
      border: 1px solid #e5e1e1;
  }
  .table th ,td{
      padding: 8px 0px;
      text-align: center;
  } 
  .skeleton {
    animation: skeleton-loading 1s linear infinite alternate;
    border-radius: 5px;
  }
  @keyframes skeleton-loading {
    0% {
      background-color: hsl(200, 20%, 94%);
    }
    100% {
      background-color: hsl(180, 100%, 100%);
    }
  }
  .skeleton-text {
    width: 100%;
    height: 1rem;
    margin-bottom: 0.5rem;
  }
  .skeleton-text__body {
    width: 75%;
  }
  .skeleton-table{
    width: 100%;
    height: 6rem;
  }
  .skeleton-room-content{
    width: 100%;
    height: 10.3rem;
  }
  .skeleton_flex{
    display: flex;
    gap: 15px;
  }
  .skeleton-img{
    width: 275px;
    height:  10.3rem;
  }
  .button-loading::after {
    content: "";
    position: absolute;
    width: 16px;
    height: 16px;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    border: 4px solid transparent;
    border-top-color: #ffffff;
    border-radius: 50%;
    animation: button-loading-spinner 1s ease infinite;
  }
  @keyframes button-loading-spinner {
    from {
      transform: rotate(0turn);
    }
    to {
      transform: rotate(1turn);
    }
  }
    @media screen and (max-width: 768px) {
        .widget_inp_list_wrap {
            flex-direction: column;
            gap: 3px;
        }
        .widget_ticket_count {
          padding: 0 30px 0 0;
        }
        .widget_form_box {
         max-width: 450px;
         width: 100%;
        }
        .skeleton_flex{
          flex-direction: column;
          gap: 5px;
        }
        .widget_ticket_count span:first-child{
          width: 25px;
          height: 25px;
          font-size: 18px;
      }
      .widget_ticket_count span:last-child{
        width: 25px;
          height: 25px;
          font-size: 18px;
      }
      
      .widget_ticket_count span:nth-child(2) {
        width: 25px;
      }
    }

    @media(max-width:580px){
      .widget_room_type_wrapper {
        display: block;
        grid-template-columns: unset;
      }
      .widget_room_type_wrapper .widget_room_image_section {
        margin: 0 auto;
        width:100%;
      }
      .widget_room_type_wrapper .widget_room_detail_right {
        text-align: center;
      }
      .widget_room_name_box {
          justify-content: center;
          padding: 10px 0 0 0;
      }
      .widget_room_pricing .widget_room_price {
        margin: 0 0 15px;
      }
      .widget_room_pricing {
        padding-top: 0;
      }
      .widget_ticket_count {
        justify-content: center;
      }
      .widget_room_type_wrapper {
        margin-bottom: 30px;
        padding: 30px 20px;
      }
      .widget_ticket_count {
        padding: 0;
      }
      .widget_btn_box_Wrapper {
        justify-content: start;
      }
      .widget_text_left {
        justify-content: flex-start;
      }
      span#ticketerror {
        width: 100%;
        display: block;
        text-align: left;
        margin: 0;
        padding: 10px 0 0;
        font-size: 16px;
      }
    }
    @media screen and (max-width: 450px) {
      .widget_form_box {
        max-width: none;
        width: 100%;
        padding:16px;
      }
      .widget_radio_btn_wrapper{
        column-count: 2;
    column-gap: 25px;
      }
      .widget_radio_btn_wrapper .widget_radio_wrap_timeslot{
           gap:5px;    
        padding: 5px;
      }
    }
    `
    return template4;
  }
}
