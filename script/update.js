const _supabaseUrl = 'https://dbmosmqilzwwhbqkwczk.supabase.co';
const _supabaseKey = 'sb_publishable_8AQWinPIQ7aMsWK0lqTI2g_M52Fkj_2';
const supabaseClient = supabase.createClient(_supabaseUrl, _supabaseKey);

let ssname = document.getElementById('ss-name-display');
let substationName = JSON.parse(localStorage.getItem('logged_in_user')).substation_name;
ssname.innerHTML = substationName;

let feedersdata = [];
let capbankdata = [];
let linedata = [];
getallfeedernames(substationName).then(data =>{
    feedersdata = data;
});
getallcapbank(substationName).then(data =>{
    capbankdata = data;
});
getalllinenames(substationName).then(data =>{
    linedata = data;
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
async function fetch19(){
    let date = document.getElementById('report-date').value;
    if (!date) { alert("Please select a date first."); return; }
    let ssName = substationName;
    let table = document.querySelector('.table-responsive');
    let html = `<table class="table-output">
        <tr>
            <th>Feeder Name</th>
            <th>Max Amp</th>
            <th>Time</th>
            <th>Update</th>
        </tr>
    `;
    count = 1;
    for (const feeder of feedersdata){
        let feedername = feeder.feeder_name;
        const feederentry = await fetchfeeder19(date,feedername,ssName,count);
        html += feederentry;
        count+=1;
    }
    html+=`</table>
    <table class="table-output">`;
    const voltentry = await fetchvolt19(date,ssName);
    html += voltentry;
    html+=`</table>`;
    count = 1;
    for (const capacitor of capbankdata){
        let capname = capacitor.capacitor_bank;
        const capentry = await fetchcap19(date, ssName, capname, count);
        html += capentry;
        count+=1;
    }
    table.innerHTML = html;
}
async function fetchcap19(date,ss,cap,id){
    const {data, error} = await supabaseClient
        .from('capdet19hrs')
        .select('*')
        .eq('date', date)
        .eq('substation_name',ss)
        .eq('capacitor_bank',cap);
    if (error){
        let htmlcode = `<div class="cap-name">
                <span class="icon">⚡</span> ${cap}
            </div>
            
            <div class="cap-grid">
                <div class="input-box">
                    <label>On Time (HH:MM)</label>
                    <div class="time-input-group">
                        <input type="number" inputmode="decimal" placeholder="Hrs" class="cap_hrs_${id}" min="0" max="23">
                        <span class="separator">:</span>
                        <input type="number" inputmode="decimal" placeholder="Min" class="cap_min_${id}" min="0" max="59">
                    </div>
                </div>

                <div class="input-box">
                    <label>Maximum Ampere</label>
                    <input type="number" inputmode="decimal" placeholder="Enter Amps" class="cap_max_amp${id}">
                </div>
                <div class="input-box">
                    <label>Tap Position</label>
                    <input type="number" inputmode="decimal" placeholder="Enter Tap" class="tap${id}">
                </div>
                <button class='update-btn' onclick='gocap("${date}","${ss}","${cap}","${id}")'>Update</button>
            </div>
        `;
        return htmlcode;
    } else{
        try{
            let htmlcode = `<div class="cap-name">
                    <span class="icon">⚡</span> ${cap}
                </div>
                
                <div class="cap-grid">
                    <div class="input-box">
                        <label>On Time (HH:MM)</label>
                        <div class="time-input-group">
                            <input type="number" inputmode="decimal" value="${data[0].hours}" placeholder="Hrs" class="cap_hrs_${id}" min="0" max="23">
                            <span class="separator">:</span>
                            <input type="number" inputmode="decimal" value="${data[0].minutes}" placeholder="Min" class="cap_min_${id}" min="0" max="59">
                        </div>
                    </div>

                    <div class="input-box">
                        <label>Maximum Ampere</label>
                        <input type="number" inputmode="decimal" value="${data[0].max_amp}" placeholder="Enter Amps" class="cap_max_amp${id}">
                    </div>
                    <div class="input-box">
                        <label>Tap Position</label>
                        <input type="number" inputmode="decimal" value="${data[0].tap}" placeholder="Enter Tap" class="tap${id}">
                    </div>
                    <button class='update-btn' onclick='updatecap("${date}","${ss}","${cap}","${id}")'>Update</button>
                </div>`;
                return htmlcode;
        } catch{
            let htmlcode = `<div class="cap-name">
                    <span class="icon">⚡</span> ${cap}
                </div>
                
                <div class="cap-grid">
                    <div class="input-box">
                        <label>On Time (HH:MM)</label>
                        <div class="time-input-group">
                            <input type="number" inputmode="decimal" placeholder="Hrs" class="cap_hrs_${id}" min="0" max="23">
                            <span class="separator">:</span>
                            <input type="number" inputmode="decimal" placeholder="Min" class="cap_min_${id}" min="0" max="59">
                        </div>
                    </div>

                    <div class="input-box">
                        <label>Maximum Ampere</label>
                        <input type="number" inputmode="decimal" placeholder="Enter Amps" class="cap_max_amp${id}">
                    </div>
                    <div class="input-box">
                        <label>Tap Position</label>
                        <input type="number" inputmode="decimal" placeholder="Enter Tap" class="tap${id}">
                    </div>
                    <button class='update-btn' onclick='gocap("${date}","${ss}","${cap}","${id}")'>Update</button>
                </div>
            `;
            return htmlcode;
        }
    }
}
async function updatecap(date, ss, cap, id) {
    let caphrs = document.querySelector(`.cap_hrs_${id}`).value;
    let capmin = document.querySelector(`.cap_min_${id}`).value;
    let amps = document.querySelector(`.cap_max_amp${id}`).value;
    let tap = document.querySelector(`.tap${id}`).value;

    if(caphrs && capmin && amps && tap){
        const {data, error} = await supabaseClient
            .from('capdet19hrs')
            .update({
                'hours' : caphrs,
                'minutes' : capmin,
                'max_amp' : amps,
                'tap' : tap
            })
            .eq('date',date)
            .eq('substation_name', ss)
            .eq('capacitor_bank', cap);
        if (error){
            alert('Error Occured Please Try Again.');
            return;
        }
        alert("Upadated Successfully");
    } else{
        alert("Please Enter Data.");
    }
}
async function gocap(date, ss, cap, id) {
    let caphrs = document.querySelector(`.cap_hrs_${id}`).value;
    let capmin = document.querySelector(`.cap_min_${id}`).value;
    let amps = document.querySelector(`.cap_max_amp${id}`).value;
    let tap = document.querySelector(`.tap${id}`).value;

    if(caphrs && capmin && amps && tap){
        const {data, error} = await supabaseClient
            .from('capdet19hrs')
            .insert({
                'date' : date,
                'substation_name': ss,
                'capacitor_bank' : cap,
                'hours' : caphrs,
                'minutes' : capmin,
                'max_amp' : amps,
                'tap' : tap
            });
        if (error){
            alert('Error Occured Please Try Again.');
            return;
        }
        alert("Upadated Successfully");
    } else{
        alert("Please Enter Data.");
    }
}
async function fetchfeeder19(date,feeder,ss,id) {
    const {data, error} = await supabaseClient
        .from('lmudet19hrs')
        .select('*')
        .eq('date',date)
        .eq('substation_name',ss)
        .eq('feeder_name',feeder);

    if(error){
        let htmlcode = `
            <tr>
                <td>${feeder}</td>
                <td><input type="number" id='amp${id}' inputmode="decimal"></td>
                <td><input type="number" id='time${id}' inputmode="decimal"></td>
                <td>
                    <button class='update-btn' onclick='updatefed("${date}","${ss}","${feeder}","${id}")'>Update</button>
                </td>
            </tr>
        `;
        return htmlcode;
    } else{
        let htmlcode = `
            <tr>
                <td>${feeder}</td>
                <td><input type="number" id='amp${id}' value='${data[0].max_amp}' inputmode="decimal"></td>
                <td><input type="number" id='time${id}' value='${data[0].time}' inputmode="decimal"></td>
                <td>
                    <button class='update-btn' onclick='updatefed("${date}","${ss}","${feeder}","${id}")'>Update</button>
                </td>
            </tr>
        `;
        return htmlcode;
    }
}
async function fetchvolt19(date,ss) {
    const {data, error} = await supabaseClient
        .from('voltdet19hrs')
        .select('*')
        .eq('date',date)
        .eq('substation_name',ss);
    if(error){
        let htmlcode = `
            <tr>
                <th></th>
                <th>Max</th>
                <th>Time</th>
                <th>Min</th>
                <th>Time</th>
            </tr>
            <tr>
                <td>11kV Side</td>
                <td><input type="number" inputmode="decimal" id="kv11_maxv" placeholder="Max"></td>
                <td><input type="number" inputmode="decimal" id="kv11_maxt" placeholder="Time"></td>
                <td><input type="number" inputmode="decimal" id="kv11_minv" placeholder="Min"></td>
                <td><input type="number" inputmode="decimal" id="kv11_mint" placeholder="Time"></td>
            </tr>
            <tr>
                <td>66kV Side</td>
                <td><input type="number" inputmode="decimal" id="kv66_maxv" placeholder="Max"></td>
                <td><input type="number" inputmode="decimal" id="kv66_maxt" placeholder="Time"></td>
                <td><input type="number" inputmode="decimal" id="kv66_minv" placeholder="Min"></td>
                <td><input type="number" inputmode="decimal" id="kv66_mint" placeholder="Time"></td>
            </tr>
            <tr><td>
                <button class='update-btn' onclick='updatevolt("${date}","${ss}")'>Update</button>
            </td></tr>
        `;
        return htmlcode;
    } else{
        let htmlcode = `
            <tr>
                <th></th>
                <th>Max</th>
                <th>Time</th>
                <th>Min</th>
                <th>Time</th>
            </tr>
            <tr>
                <td>11kV Side</td>
                <td><input type="number" inputmode="decimal" value="${data[0].kv11_max}" id="kv11_maxv" placeholder="Max"></td>
                <td><input type="number" inputmode="decimal" value="${data[0].kv11_max_time}" id="kv11_maxt" placeholder="Time"></td>
                <td><input type="number" inputmode="decimal" value="${data[0].kv11_min}" id="kv11_minv" placeholder="Min"></td>
                <td><input type="number" inputmode="decimal" value="${data[0].kv11_min_time}" id="kv11_mint" placeholder="Time"></td>
            </tr>
            <tr>
                <td>66kV Side</td>
                <td><input type="number" inputmode="decimal" value="${data[0].kv66_max}" id="kv66_maxv" placeholder="Max"></td>
                <td><input type="number" inputmode="decimal" value="${data[0].kv66_max_time}" id="kv66_maxt" placeholder="Time"></td>
                <td><input type="number" inputmode="decimal" value="${data[0].kv66_min}" id="kv66_minv" placeholder="Min"></td>
                <td><input type="number" inputmode="decimal" value="${data[0].kv66_min_time}" id="kv66_mint" placeholder="Time"></td>
            </tr>
            <tr><td>
                <button class='update-btn' onclick='updatevolt("${date}","${ss}")'>Update</button>
            </td></tr>
        `;
        return htmlcode;
    }
}
async function updatevolt(date,ss) {
    let kv11maxv = document.getElementById('kv11_maxv').value;
    let kv11maxt = document.getElementById('kv11_maxt').value;
    let kv11minv = document.getElementById('kv11_minv').value;
    let kv11mint = document.getElementById('kv11_mint').value;
    let kv66maxv = document.getElementById('kv66_maxv').value;
    let kv66maxt = document.getElementById('kv66_maxt').value;
    let kv66minv = document.getElementById('kv66_minv').value;
    let kv66mint = document.getElementById('kv66_mint').value;
    if(kv11maxv && kv11maxt && kv11minv && kv11mint && kv66maxv && kv66maxt && kv66minv && kv66mint){
        const {data, error} = await supabaseClient
            .from('voltdet19hrs')
            .update({
            'kv11_max' : kv11maxv,
            'kv11_max_time' : kv11maxt,
            'kv11_min' : kv11minv,
            'kv11_min_time' : kv11mint,
            'kv66_max' : kv66maxv,
            'kv66_max_time' : kv66maxt,
            'kv66_min' : kv66minv,
            'kv66_min_time' : kv66mint})
            .eq('date',date)
            .eq('substation_name',ss);
        if(error){
            alert('Error. Please Try Again...');
            return;
        }
        alert("Updated successfully!");

    } else{
        alert("Please Enter Voltages");
    }
}
async function updatefed(date,ss,feeder,id) {
    let maxamp = document.getElementById(`amp${id}`).value;
    let time = document.getElementById(`time${id}`).value;

    const {data,error} = await supabaseClient
        .from('lmudet19hrs')
        .update({'max_amp':maxamp,'time':time})
        .eq('date',date)
        .eq('substation_name',ss)
        .eq('feeder_name',feeder);
    if(error){
        alert("Error occured, please try again or contact Nodal.");
        return;
    }
    alert("Updated successfully!");
}
async function fetch24() {
    let date = document.getElementById('report-date').value;
    if (!date) { alert("Please select a date first."); return; }
    let ssName = substationName;
    let table = document.querySelector('.table-responsive');
    let html = `<table class="table-output">
        <tr>
            <th>Feeder Name</th>
            <th>MWH</th>
            <th>Update</th>
        </tr>
    `;
    count = 1;
    for (const feeder of feedersdata){
        let feedername = feeder.feeder_name;
        const feederentry = await fetchfeeder24(date,feedername,ssName,count);
        html += feederentry;
        count+=1;
    }
    let stationfeeder = 'Station';
    const stationentry = await fetchfeeder24(date,stationfeeder,ssName,count);
    html += stationentry;
    count += 1;

    let lvfeeder = 'LV Total';
    const lventry = await fetchfeeder24(date,lvfeeder,ssName,count);
    html += lventry;
    html+=`</table>
        <div>`;
    count = 1;
    for (line of linedata){
        let linename = line.line_name;
        const linenetry = await fetchline24(date,ssName,linename,count);
        html += linenetry;
        count+=1;
    }
    html+=`</div>`;
    table.innerHTML = html;
}
async function fetchline24(date,ss,line,id) {
    const {data, error} = await supabaseClient
        .from('linedet24hrs')
        .select('*')
        .eq('date',date)
        .eq('substation_name',ss)
        .eq('line_name',line);
    if (error){
        let htmlcode = `<table class="line-table"><tr class="line-name-cell">
                ${line}
            </tr>
            <tr>
                <div class="input-wrapper">
                    <input type="number" inputmode="decimal"
                        class="line-import-${id}" 
                        placeholder="Import">
                    <span class="unit">MW</span>
                </div>
            </tr>
            <tr>
                <div class="input-wrapper">
                    <input type="number" inputmode="decimal"
                        class="line-export-${id}" 
                        placeholder="Export">
                    <span class="unit">MW</span>
                </div>
            </tr>
            <tr>
                <button class='update-btn' onclick='updateline("${date}","${ss}","${line}","${id}")'>Update</button>
            </tr>
            </table>
        `;
        return htmlcode;
    } else{
        let htmlcode = `<table class="line-table"><tr><td class="line-name-cell">
                ${line}
            </td></tr><tr>
            <td>
                <div class="input-wrapper">
                    <input type="number" inputmode="decimal" 
                        value="${data[0].import}"
                        class="line-import-${id}" 
                        placeholder="Import">
                    <span class="unit">MW</span>
                </div>
            </td></tr><tr>
            <td>
                <div class="input-wrapper">
                    <input type="number" inputmode="decimal"
                        value="${data[0].export}"
                        class="line-export-${id}" 
                        placeholder="Export">
                    <span class="unit">MW</span>
                </div>
            </td></tr><tr>
            <td>
                <button class='update-btn' onclick='updateline("${date}","${ss}","${line}","${id}")'>Update</button>
            </td></tr>
            </table>
        `;
        return htmlcode;
    }
}
async function updateline(date, ss, line, id) {
    let imp = document.querySelector(`.line-import-${id}`).value;
    let exp = document.querySelector(`.line-export-${id}`).value;

    if(imp && exp){
        const {data, error} = await supabaseClient
            .from('linedet24hrs')
            .update({
                'import':imp,
                'export':exp
            })
            .eq('date', date)
            .eq('substation_name', ss)
            .eq('line_name',line);
        if(error){
            alert('Error occured, Please Try Again');
            return;
        }
        alert('Updated Successfully')
    } else{
        alert('Please Enter Data');
    }
}
async function fetchfeeder24(date,feeder,ss,id) {
    const {data, error} = await supabaseClient
        .from('lmudet24hrs')
        .select('*')
        .eq('date',date)
        .eq('substation_name',ss)
        .eq('feeder_name',feeder);

    if(error){
        let htmlcode = `
            <tr>
                <td>${feeder}</td>
                <td><input type="number" id='mwh${id}' inputmode="decimal"></td>
                <td>
                    <button class='update-btn' onclick='update24("${date}","${ss}","${feeder}","${id}")'>Update</button>
                </td>
            </tr>
        `;
        return htmlcode;
    } else{
        let htmlcode = `
            <tr>
                <td>${feeder}</td>
                <td><input type="number" id='mwh${id}' inputmode="decimal" value='${data[0].sent_out}'></td>
                <td>
                    <button class='update-btn' onclick='update24("${date}","${ss}","${feeder}","${id}")'>Update</button>
                </td>
            </tr>
        `;
        return htmlcode;
    }
}
async function update24(date,ss,feeder,id) {
    let mwh = document.getElementById(`mwh${id}`).value;

    const {data,error} = await supabaseClient
        .from('lmudet24hrs')
        .update({'sent_out': mwh})
        .eq('date',date)
        .eq('substation_name',ss)
        .eq('feeder_name',feeder);
    if(error){
        alert("Error occured, please try again or contact Nodal.");
        return;
    }
    alert("Updated successfully!");
}