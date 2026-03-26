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
    let html = `<thead>
                            <tr>
                                <th>Feeder Name</th>
                                <th>Amps</th>
                                <th>Time</th>
                            </tr>
                        </thead>`;
    
    count = 1;
    data.forEach(feeder => {
        html+= `
            <tr>
                <td>${feeder.feeder_name}</td>
                <td><input type="number" inputmode="decimal" class="amp_feeder${count}" placeholder="Amp"></td>
                <td><input type="number" inputmode="decimal" class="time_feeder${count}" placeholder="Time"></td>
            </tr>
        `;
        count+=1;
    });
    table19.innerHTML = html;
    let table24 = document.querySelector('.t2');
    let html24 = `<thead>
                            <tr>
                                <th>Feeder Name</th>
                                <th>MWH</th>
                            </tr>
                        </thead>`;
    count = 1;
    data.forEach(feeder => {
        html24 += `
            <tr>
                <td>${feeder.feeder_name}</td>
                <td><input type="number" inputmode="decimal" class="mwh_feeder${count}" placeholder="MWH"></td>
            </tr>
        `;
        count+=1;
    });

    html24+=`
        <tr>
                <td>Station</td>
                <td><input type="number" inputmode="decimal" class="mwh_feeder${count}" placeholder="MWH"></td>
        </tr>
        <tr>
                <td>LV Total</td>
                <td><input type="number" inputmode="decimal" class="mwh_feeder${count+1}" placeholder="MWH"></td>
        </tr>
    `;

    table24.innerHTML = html24;
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
                        <input type="number" inputmode="decimal" placeholder="Hrs" class="cap_hrs_${count}" min="0" max="23">
                        <span class="separator">:</span>
                        <input type="number" inputmode="decimal" placeholder="Min" class="cap_min_${count}" min="0" max="59">
                    </div>
                </div>

                <div class="input-box">
                    <label>Maximum Ampere</label>
                    <input type="number" inputmode="decimal" placeholder="Enter Amps" class="cap_max_amp${count}">
                </div>
                <div class="input-box">
                    <label>Tap Position</label>
                    <input type="number" inputmode="decimal" placeholder="Enter Tap" class="tap${count}">
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
                    <input type="number" inputmode="decimal" 
                        class="line-import-${count}" 
                        placeholder="Import">
                    <span class="unit">MW</span>
                </div>
            </td>
            <td>
                <div class="input-wrapper">
                    <input type="number" inputmode="decimal"
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
async function check19(date,ss) {
    const {data, error} = await supabaseClient.from('lmudet19hrs').select('*').eq('date',date).eq('substation_name',ss);
    if(error){
        return false;
    }
    return data.length > 0;
}
async function submit19(){
    let date = document.getElementById('report-date').value;
    if (!date) { alert("Please select a date first."); return; }
    let button = document.querySelector('.b1');
    let buttontext = document.querySelector('.bb1');
    buttontext.innerText = 'Submitting...';

    let newssname = substationName;
    let ifdata = await check19(date,newssname);
    if(!ifdata){
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

                if(max_amp && time) {loading_feeder.push({
                    'date' : date,
                    'substation_name' : newssname,
                    'feeder_name' : feederName,
                    'max_amp' : max_amp,
                    'time' : time
                });} else {
                    loading_feeder.push({
                    'date' : date,
                    'substation_name' : newssname,
                    'feeder_name' : feederName,
                    'max_amp' : '0',
                    'time' : '0'
                });
                }
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
            alert('✅ data submitted successfully');
            button.disabled = true;
            buttontext.style.opacity = '0.5';
            buttontext.innerText = 'Submitted';
        } else{
            alert('Voltage data entry is compulsory...!!!');
        }
    } else {
        alert(`❌ Data Already Entered for Dt.${date}`);
        buttontext.innerText = 'Submit Report';
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
async function check24(date, ss) {
    const {data, error} = await supabaseClient.from('lmudet24hrs').select('*').eq('date',date).eq('substation_name',ss);
    if(error){
        return false;
    }
    return data.length > 0;
}
async function submit24(){
    let date = document.getElementById('report-date').value;
    if (!date) { alert("Please select a date first."); return; }
    let button = document.querySelector('.b2');
    let buttontext = document.querySelector('.bb2');
    
    buttontext.innerText = 'Submitting...';

    let newssname = substationName;
    let ifdata = await check24(date,newssname);
    if(!ifdata){
        let count = 1;
        let mwhdata = [];
        feedersdata.forEach(feeder=>{
            let mwh = document.querySelector(`.mwh_feeder${count}`).value;

            if(mwh){
                mwhdata.push({
                    'date' : date,
                    'substation_name' : newssname,
                    'feeder_name' : feeder.feeder_name,
                    'sent_out' : mwh
                });
            } else {
                mwhdata.push({
                    'date' : date,
                    'substation_name' : newssname,
                    'feeder_name' : feeder.feeder_name,
                    'sent_out' : '0'
                });
            }
            count++;
        });
        let stationmwh = document.querySelector(`.mwh_feeder${count}`).value;
        mwhdata.push({
            'date' : date,
            'substation_name' : newssname,
            'feeder_name' : 'Station',
            'sent_out' : stationmwh
        });
        count++;
        let lvtotal = document.querySelector(`.mwh_feeder${count}`).value;
        mwhdata.push({
            'date' : date,
            'substation_name' : newssname,
            'feeder_name' : 'LV Total',
            'sent_out' : lvtotal
        });

        loadlmu24(mwhdata);
        count = 1;
        let linedetail = [];
        linedata.forEach(line=>{
            let imp = document.querySelector(`.line-import-${count}`).value;
            let exp = document.querySelector(`.line-export-${count}`).value;

            if(imp && exp){
                linedetail.push({
                    'date' : date,
                    'substation_name' : newssname,
                    'line_name' : line.line_name,
                    'import' : imp,
                    'export' : exp
                });
            } else {
                linedetail.push({
                    'date' : date,
                    'substation_name' : newssname,
                    'line_name' : line.line_name,
                    'import' : '0',
                    'export' : '0'
                });
            }
            count++;
        });
        if (linedetail.length>0){
            loadlinedata(linedetail);
        }
        alert('✅ data submitted successfully');
        button.disabled = true;
        buttontext.style.opacity = '0.5';
        buttontext.innerText = 'Submitted';
    } else{
        alert(`❌ Data already submitted for dt.${date}`);
        buttontext.innerText = 'Submit Report';
    }
}
async function loadlmu24(array) {
    const { data, error } = await supabaseClient
        .from('lmudet24hrs')
        .insert(array);
    if (error){
        console.log('Error occured while uploading LMU 24 Hrs detail.');
    } else{
        console.log('LMU 24Hrs data uploaded successfully.');
    }
}
async function loadlinedata(array) {
    const { data, error } = await supabaseClient
        .from('linedet24hrs')
        .insert(array);
    if (error){
        console.log('Error occured while uploading line data');
    } else{
        console.log('Line data uploaded successfully');
    }
}
function update(){
    window.location.href = 'update.html';
}