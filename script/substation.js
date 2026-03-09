const _supabaseUrl = 'https://dbmosmqilzwwhbqkwczk.supabase.co';
const _supabaseKey = 'sb_publishable_8AQWinPIQ7aMsWK0lqTI2g_M52Fkj_2';
const supabaseClient = supabase.createClient(_supabaseUrl, _supabaseKey);

let button19 = true;
let button24 = true;

let ssname = document.getElementById('ss-name-display');
let substationName = JSON.parse(localStorage.getItem('logged_in_user')).substation_name;
ssname.innerHTML = substationName;
let feedersdata = [];
let capbankdata = [];
let linedata = [];
getallfeedernames(substationName).then(data =>{
    feedersdata = data;
    let table19 = document.querySelector('.t1');
    table19.innerHTML = `<thead>
                            <tr>
                                <th>Feeder Name</th>
                                <th>Amps</th>
                                <th>Time</th>
                            </tr>
                        </thead>`;
    count = 1;
    data.forEach(feeder => {
        let new_feeder_row = document.createElement('tr');
        let feeder_nm = document.createElement('td');
        feeder_nm.innerHTML = feeder.feeder_name;
        new_feeder_row.appendChild(feeder_nm);

        let ampdatatd = document.createElement('td');
        let ampdata = document.createElement('input');
        ampdata.classList.add(`amp_feeder${count}`);
        ampdatatd.appendChild(ampdata);
        new_feeder_row.appendChild(ampdatatd);

        let timedatatd = document.createElement('td');
        let timedata = document.createElement('input');
        timedata.classList.add(`time_feeder${count}`);
        timedatatd.appendChild(timedata);
        new_feeder_row.appendChild(timedatatd);

        table19.appendChild(new_feeder_row);
        count+=1;
    });

    let table24 = document.querySelector('.t2');
    table24.innerHTML = `<thead>
                            <tr>
                                <th>Feeder Name</th>
                                <th>MWH</th>
                            </tr>
                        </thead>`;
    count = 1;
    data.forEach(feeder => {
        let new_feeder_row = document.createElement('tr');
        let feeder_nm = document.createElement('td');
        feeder_nm.innerHTML = feeder.feeder_name;
        new_feeder_row.appendChild(feeder_nm);

        let mwhdatatd = document.createElement('td');
        let mwhdata = document.createElement('input');
        mwhdata.classList.add(`mwh_feeder${count}`);
        mwhdatatd.appendChild(mwhdata);
        new_feeder_row.appendChild(mwhdatatd);

        table24.appendChild(new_feeder_row);
        count+=1;
    });
    let new_feeder_row = document.createElement('tr');
    let feeder_nm = document.createElement('td');
    feeder_nm.innerHTML = 'Station';
    new_feeder_row.appendChild(feeder_nm);

    let mwhdatatd = document.createElement('td');
    let mwhdata = document.createElement('input');
    mwhdata.classList.add(`mwh_feeder${count}`);
    mwhdatatd.appendChild(mwhdata);
    new_feeder_row.appendChild(mwhdatatd);

    table24.appendChild(new_feeder_row);

    count+=1;

    let new_feeder_row1 = document.createElement('tr');
    let feeder_nm1 = document.createElement('td');
    feeder_nm1.innerHTML = 'LV Total';
    new_feeder_row1.appendChild(feeder_nm1);

    let mwhdatatd1 = document.createElement('td');
    let mwhdata1 = document.createElement('input');
    mwhdata1.classList.add(`mwh_feeder${count}`);
    mwhdatatd1.appendChild(mwhdata1);
    new_feeder_row1.appendChild(mwhdatatd1);

    table24.appendChild(new_feeder_row1);
});
getallcapbank(substationName).then(data =>{
    capbankdata = data;
    count = 1;
    let capabankdet = document.querySelector('.t111');
    data.forEach(caps => {
        let capCard = document.createElement('div');
        capCard.className = 'cap-entry-card';

        capCard.innerHTML = `
            <div class="cap-name">
                <span class="icon">⚡</span> ${caps.capacitor_bank}
            </div>
            
            <div class="cap-grid">
                <div class="input-box">
                    <label>On Time (HH:MM)</label>
                    <div class="time-input-group">
                        <input type="number" placeholder="Hrs" class="cap_hrs_${count}" min="0" max="23">
                        <span class="separator">:</span>
                        <input type="number" placeholder="Min" class="cap_min_${count}" min="0" max="59">
                    </div>
                </div>

                <div class="input-box">
                    <label>Maximum Ampere</label>
                    <input type="text" placeholder="Enter Amps" class="cap_max_amp${count}">
                </div>
                <div class="input-box">
                    <label>Tap Position</label>
                    <input type="text" placeholder="Enter Tap" class="tap${count}">
                </div>
            </div>
        `;
        
        capabankdet.appendChild(capCard);
        count+=1;
    });
});
getalllinenames(substationName).then(data =>{
    linedata = data;
    let linetable = document.getElementById('line-details-body');
    count = 1;
    data.forEach(line => {
        const row = document.createElement('tr');
        row.className = 'line-row';
        row.innerHTML = `
            <td class="line-name-cell">
                ${line.line_name}
            </td>
            <td>
                <div class="input-wrapper">
                    <input type="text" 
                           class="line-import-${count}" 
                           placeholder="Import">
                    <span class="unit">MW</span>
                </div>
            </td>
            <td>
                <div class="input-wrapper">
                    <input type="text" 
                           class="line-export-${count}" 
                           placeholder="Export">
                    <span class="unit">MW</span>
                </div>
            </td>
        `;
        linetable.appendChild(row);
        count+=1;
    });
});
async function getallcapbank(ssName) {
    const { data, error} = await supabaseClient
        .from('capacitorbanks')
        .select('capacitor_bank')
        .eq('substation_name',ssName);
    if (error) {
        console.error("Error fetching Capacitor Banks:", error.message);
        return [];
    }
    return data;
}
async function getallfeedernames(ssName) {
    const { data, error} = await supabaseClient
        .from('feeders')
        .select('feeder_name')
        .eq('substation_name',ssName);
    if (error) {
        console.error("Error fetching feeders:", error.message);
        return [];
    }
    return data;
}
async function getalllinenames(ssName) {
    const { data, error } = await supabaseClient
        .from('linenames')
        .select('line_name')
        .eq('substation_name',ssName);
    if (error) {
        console.error("Error fetching Line Names:", error.message);
        return [];
    }
    return data;
}
function detail19(){
    let t19table = document.querySelector('.det19');
    let t24table = document.querySelector('.t2');
    let t24tablel = document.querySelector('.t22');

    t19table.classList.remove('t19');
    if (button24 == false){
        t24table.classList.add('t24');
        t24tablel.classList.add('t24');
    }
    button19 = false;
    button24 = false;
}
function detail24(){
    let t19table = document.querySelector('.det19');
    let t24table = document.querySelector('.t2');
    let t24tablel = document.querySelector('.t22');

    t24table.classList.remove('t24');
    t24tablel.classList.remove('t24');

    if (button19 == false){
        t19table.classList.add('t19');
    }
    button24 = false;
    button19 = false;
}
function submit19(){
    let newssname = substationName;
    let date = document.getElementById('report-date').value;

    let kv11maxv = document.getElementById('kv11_maxv').value;
    let kv11maxt = document.getElementById('kv11_maxt').value;
    let kv11minv = document.getElementById('kv11_minv').value;
    let kv11mint = document.getElementById('kv11_mint').value;
    let kv66maxv = document.getElementById('kv66_maxv').value;
    let kv66maxt = document.getElementById('kv66_maxt').value;
    let kv66minv = document.getElementById('kv66_minv').value;
    let kv66mint = document.getElementById('kv66_mint').value;
    if(kv11maxv && kv11maxt && kv11minv && kv11mint && kv66maxv && kv66maxt && kv66minv && kv66mint){
        let voltage = {
            'date' : date,
            'substation_name' : newssname,
            'kv11_max' : kv11maxv,
            'kv11_max_time' : kv11maxt,
            'kv11_min' : kv11minv,
            'kv11_min_time' : kv11mint,
            'kv66_max' : kv66maxv,
            'kv66_max_time' : kv66maxt,
            'kv66_min' : kv66minv,
            'kv66_min_time' : kv66mint
        }
        loadvoltage(voltage);

        let loading_feeder = [];
        let count = 1;
        feedersdata.forEach(feeder=>{
            let max_amp = document.querySelector(`.amp_feeder${count}`).value;
            let time = document.querySelector(`.time_feeder${count}`).value;
            let feederName = feeder.feeder_name;

            loading_feeder.push({
                'date' : date,
                'substation_name' : newssname,
                'feeder_name' : feederName,
                'max_amp' : max_amp,
                'time' : time
            });
            count++;
        });
        loadlmu19(loading_feeder);

        count = 1;
        let caparray = [];
        capbankdata.forEach(bank=>{
            let caphrs = document.querySelector(`.cap_hrs_${count}`).value;
            let capmin = document.querySelector(`.cap_min_${count}`).value;
            let amps = document.querySelector(`.cap_max_amp${count}`).value;
            let tap = document.querySelector(`.tap${count}`).value;

            if (caphrs && amps && tap){
                caparray.push({
                    'date' : date,
                    'substation_name' : newssname,
                    'capacitor_bank' : bank.capacitor_bank,
                    'hours' : caphrs,
                    'minutes' : capmin,
                    'max_amp' : amps,
                    'tap' : tap
                })
            }
            count++;
        });
        if (caparray.length>0){
            loadcap(caparray);
        }
    } else{
        alert('Voltage data entry is compulsory...!!!');
    }
}
async function loadlmu19(array) {
    const { data, error } = await supabaseClient.from('lmudet19hrs').insert(array);
    if (error){
        console.log('Error occured uploading data of lmu 19hrs detail');
    } else{
        console.log('LMU 19hrs detail is uploaded successfuly');
    }
}
async function loadvoltage(array) {
    const { data, error } = await supabaseClient.from('voltdet19hrs').insert(array);
    if (error){
        console.log('Error occured uploading data of lmu 19hrs detail');
    } else{
        console.log('LMU 19hrs detail is uploaded successfuly');
    }
}
async function loadcap(array) {
    const { data, error} = await supabaseClient.from('capdet19hrs').insert(array);
    if (error){
        console.log('error while uploading capacitor data');
    } else{
        console.log('capacitor data uploaded successfuly');
    }
}