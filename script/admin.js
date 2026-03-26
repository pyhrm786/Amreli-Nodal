const _supabaseUrl = 'https://dbmosmqilzwwhbqkwczk.supabase.co';
const _supabaseKey = 'sb_publishable_8AQWinPIQ7aMsWK0lqTI2g_M52Fkj_2';
const supabaseClient = supabase.createClient(_supabaseUrl, _supabaseKey);

let x1 = false;
let x2 = false;
let x3 = false;
let x4 = false;

let t1 = true;
let t2 = false;

let datass = [];

getAllSubstations().then(data =>{
    let ssoptions = document.getElementById('ss-dropdown');
    ssoptions.innerHTML = '';
    let ssoptions2 = document.getElementById('ss-dropdown2');
    ssoptions2.innerHTML = '';
    let ssoptions3 = document.getElementById('ss-dropdown3');
    ssoptions3.innerHTML = '';
    let ssoptions4 = document.getElementById('ss-dropdown4');
    ssoptions4.innerHTML = '';
    data.forEach(ss_name => {
        let newoption = document.createElement('option');
        newoption.innerHTML = ss_name.substation_name;
        newoption.setAttribute('value', ss_name.substation_name);
        ssoptions.appendChild(newoption);
    });
    data.forEach(ss_name => {
        let newoption = document.createElement('option');
        newoption.innerHTML = ss_name.substation_name;
        newoption.setAttribute('value', ss_name.substation_name);
        ssoptions2.appendChild(newoption);
    });
    data.forEach(ss_name => {
        let newoption = document.createElement('option');
        newoption.innerHTML = ss_name.substation_name;
        newoption.setAttribute('value', ss_name.substation_name);
        ssoptions3.appendChild(newoption);
    });
    data.forEach(ss_name => {
        let newoption = document.createElement('option');
        newoption.innerHTML = ss_name.substation_name;
        newoption.setAttribute('value', ss_name.substation_name);
        ssoptions4.appendChild(newoption);
    });
    datass = data;
});

function showTabss(){
    let ssbutton = document.getElementById('g1');
    let feederbutton = document.getElementById('g2');
    let selects = document.getElementById('d1');

    if(t1 == false){
        selects.classList.add('off');
        feederbutton.classList.remove('active');
        ssbutton.classList.add('active');
        t1 = true;
        t2 = false;
    }
    
    let tabless = document.getElementById('mgmt-table');
    tabless.innerHTML = `<th>Sr No.</th>
        <th>Substation Name</th>
        <th>Substation ID</th>
        <th>Action</th>
    `;
    let i = 1;
    datass.forEach(ssdet =>{
        let row = document.createElement('tr');
        row.innerHTML = `<td>${i}</td>
            <td>${ssdet.substation_name}</td>
            <td>${ssdet.substation_id}</td>
            <td><button class='delete-btn' onclick='deletess("${ssdet.substation_name}")'>Delete</button></td>
        `;
        i++;
        tabless.appendChild(row);
    });
}
function showTabfed(){
    let ssbutton = document.getElementById('g1');
    let feederbutton = document.getElementById('g2');
    let selects = document.getElementById('d1');

    if(t2 == false){
        selects.classList.remove('off');
        feederbutton.classList.add('active');
        ssbutton.classList.remove('active');
        t1 = false;
        t2 = true;
        let tabless = document.getElementById('mgmt-table');
        tabless.innerHTML = '';
    }
}
async function feeds(subsName) {
    const { data, error } = await supabaseClient.from('feeders').select('*').eq('substation_name', subsName);
    if (error){
        console.log('error occured while loading feeders');
    } else{
        return data;
    }
}
function showselected(){
    let subsName = document.getElementById('ss-dropdown2').value;
    feeds(subsName).then(datafed=>{
        let tabless = document.getElementById('mgmt-table');
        tabless.innerHTML = `<th>Sr No.</th>
            <th>Substation Name</th>
            <th>Feeder Name</th>
            <th>Feeder Type</th>
            <th>Feeder Group</th>
            <th>Action</th>
        `;
        let i = 1;

        datafed.forEach(det =>{
            let row = document.createElement('tr');
            row.innerHTML = `<td>${i}</td>
                <td>${det.substation_name}</td>
                <td>${det.feeder_name}</td>
                <td>${det.feeder_type}</td>
                <td>${det.feeder_group}</td>
                <td><button class='delete-btn' onclick='deletefed("${det.substation_name}","${det.feeder_name}")'>Delete</button></td>
            `;
            i++;
            tabless.appendChild(row);
        });
    });
}
async function addUser(newuser) {
    const {data, error} = await supabaseClient.from('users').insert([newuser]);
    if(error){
        console.log('Error Occured', error.message);
    }
    else{
        console.log('Success...!!!');
        alert('Added Successfully');
    }
}
function addSubstation(){
    const ssName = document.getElementById('new-ss-name').value;
    const ssId = document.getElementById('new-ss-id').value;
    const userName = document.getElementById('new-ss-user').value;
    const passWord = document.getElementById('new-ss-pass').value;

    console.log(ssName, ssId, userName, passWord);

    if (ssName && ssId && userName && passWord){
        let newuser = {
            substation_name: ssName,
            substation_id: ssId,
            username: userName,
            password: passWord
        }
        addUser(newuser);
    } else{
        alert('Enter all Details');
    }
}
function expandadss(){
    let e1 = document.querySelector('.a1');
    let btn = document.querySelector('.addssbutton');
    if (x1 == false){
        e1.classList.remove('f1');
        btn.innerHTML = '⇓ Add New Substation';
        x1 = true;
    } else if (x1 == true){
        e1.classList.add('f1');
        btn.innerHTML = '⇒ Add New Substation';
        x1 = false;
    }
}
function expandadfeeder(){
    let e2 = document.querySelector('.a2');
    let btn = document.querySelector('.addfeederbutton');
    if (x2 == false){
        e2.classList.remove('f2');
        btn.innerHTML = '⇓ Add New Feeder';
        x2 = true;
    } else if (x2 == true){
        e2.classList.add('f2');
        btn.innerHTML = '⇒ Add New Feeder';
        x2 = false;
    }
}
function expandcap(){
    let e3 = document.querySelector('.a3');
    let btn = document.querySelector('.addcapacitorbutton');
    if (x3 == false){
        e3.classList.remove('f3');
        btn.innerHTML = '⇓ Add New Capacitor Bank';
        x3 = true;
    } else if (x3 == true){
        e3.classList.add('f3');
        btn.innerHTML = '⇒ Add New Capacitor Bank';
        x3 = false;
    }
}
function expandline(){
    let e4 = document.querySelector('.a4');
    let btn = document.querySelector('.addlinebutton');
    if (x4 == false){
        e4.classList.remove('f4');
        btn.innerHTML = '⇓ Add New Line';
        x4 = true;
    } else if (x4 == true){
        e4.classList.add('f4');
        btn.innerHTML = '⇒ Add New Line';
        x4 = false;
    }
}
function addCapacitor(){
    let ss_nm = document.getElementById('ss-dropdown3').value;
    let cap_name = document.getElementById('new-capacitor-name').value;
    let cap_capacity = document.getElementById('new-capacitor-capacity').value;

    if (ss_nm && cap_name && cap_capacity){
        let newcap = {
            substation_name : ss_nm,
            capacitor_bank : cap_name,
            capacity : cap_capacity
        }
        console.log(newcap);
        loadCapacitor(newcap);
    } else{
        alert('Please Enter All Details');
    }
}
async function loadCapacitor(newcap) {
    const { data, error } = await supabaseClient
        .from('capacitorbanks')
        .insert(newcap)
    if (error){
        console.log('Error Occured', error.message);
    } else{
        console.log('Success...!!!');
        alert('New Capacitor Bank Added Successfully');
    }
}
function addLine(){
    let ss_nm = document.getElementById('ss-dropdown4').value;
    let line_name = document.getElementById('new-line-name').value;

    if (ss_nm && line_name){
        let new_line = {
            substation_name : ss_nm,
            line_name : line_name
        }
        console.log(new_line);
        loadLine(new_line);
    } else{
        alert('Please Enter All Details');
    }
}
async function loadLine(new_line) {
    const { data, error } = await supabaseClient
        .from('linenames')
        .insert(new_line);
    if (error){
        console.log('Error Occured', error.message);
    } else{
        console.log('Success...!!!');
        alert('New Line Added Successfully');
    }
}
async function getAllSubstations() {
    const { data, error } = await supabaseClient
        .from('users')
        .select('substation_name, substation_id');
    if (error) {
        console.error('Error fetching substations:', error.message);
        return;
    }
    return data;
}
function addFeeder(){
    let ss_nm = document.getElementById('ss-dropdown').value;
    let feeder_nm = document.getElementById('new-feeder-name').value;
    let feeder_tp = document.getElementById('new-feeder-type').value;
    let feeder_grp = document.getElementById('new-feeder-group').value;

    if (feeder_nm && feeder_tp && feeder_grp){
        let new_feeder = {
            substation_name: ss_nm,
            feeder_name: feeder_nm,
            feeder_type: feeder_tp,
            feeder_group: feeder_grp
        };

        console.log(new_feeder);
        load_feeder(new_feeder);
    } else{
        alert('Please Enter All Details');
    }
}
async function load_feeder(new_feeder) {
    const {data, error} = await supabaseClient.from('feeders').insert([new_feeder]);
    if(error){
        console.log('Error Occured', error.message);
    }
    else{
        console.log('Success...!!!');
        alert('New Feeder Added Successfully');
    }
}
async function getallFeeders() {
    const { data, error } = await supabaseClient.
        from('feeders').
        select('substation_name, feeder_name, feeder_type, feeder_group');
    if (error){
        console.log('Error occured while loading feeders');
    } else{
        return data;
    }
}
function deletess(ss){
    deleterow(ss);
}
async function deleterow(ss){
    const {data, error}= await supabaseClient.from('users').delete().eq('substation_name',ss);
    if (error) {
        console.error('Error deleting:', error.message);
    } else {
        alert('Substation deleted successfully');
    }
}
function deletefed(ss,feeder){
    deletefeeder(ss,feeder);
}
async function deletefeeder(ss,feeder) {
    const {data, error}= await supabaseClient.from('feeders').delete().eq('substation_name',ss).eq('feeder_name',feeder);
    if (error) {
        console.error('Error deleting:', error.message);
    } else {
        alert('Feeder deleted successfully');
    }
}
function toggleGenerateMenu() {
    const menu = document.getElementById('gen-menu');
    const arrow = document.getElementById('menu-arrow');
    
    menu.classList.toggle('open');
    
    if (menu.classList.contains('open')) {
        arrow.style.transform = 'rotate(180deg)';
    } else {
        arrow.style.transform = 'rotate(0deg)';
    }
}
function exportData(report){
    let date = document.getElementById('gen-date').value;

    if(report == 'lmu'){
        downloadlmu(date);
    } else if(report == 'voltage'){
        downloadvoltage(date);
    } else if(report == 'capacitor'){
        downloadcapacitor(date);
    } else if(report == 'line'){
        downloadline(date);
    }
}
async function downloadlmu(date) {
    if (!date) { alert("Please select a date first."); return; }

    const [res19, res24, resfeeder] = await Promise.all([
        supabaseClient.from('lmudet19hrs').select('*').eq('date', date),
        supabaseClient.from('lmudet24hrs').select('*').eq('date', date),
        supabaseClient.from('feeders').select('*')
    ]);

    if (res19.error || res24.error) { alert("Error fetching data"); return; }

    let table = document.getElementById('my-table');
    let html = `
        <tr>
            <td>Substation Name</td>
            <td>Feeder Name</td>
            <td>Amp</td>
            <td>Time</td>
            <td>Sent Out</td>
            <td>LV Total</td>
        </tr>
    `;
    let mapstation = Object.fromEntries(res24.data.filter(d=>d.feeder_name == 'Station').map(d=>[d.substation_name, d]));
    let maplv = Object.fromEntries(res24.data.filter(d=>d.feeder_name == 'LV Total').map(d=>[d.substation_name, d]));
    const map19 = {};
    res19.data.forEach(d => {
        if (!map19[d.substation_name]) map19[d.substation_name] = {};
        map19[d.substation_name][d.feeder_name] = d;
    });
    const map24 = {};
    res24.data.forEach(d => {
        if (!map24[d.substation_name]) map24[d.substation_name] = {};
        map24[d.substation_name][d.feeder_name] = d;
    });
    const substations = [
        "66kV Amreli-A SS",
        "66kV Amreli-B SS",
        "66kV Gavadka SS",
        "66kV Simran SS",
        "66kV Bagasara SS",
        "66kV Kukavav SS",
        "66kV Liliya SS",
        "66kV Gundaran SS",
        "66kV Chalala SS",
        "66kV Sarambhada SS",
        "66kV Lathi SS",
        "66kV Jaliya SS",
        "66kV Babra SS",
        "66kV Malaviya Pipariya SS",
        "66kV Gariyadhar SS",
        "66kV Damnagar SS",
        "66kV Chital SS",
        "66kV Kotdapitha SS",
        "66kV Khambhala SS",
        "66kV Tori SS",
        "66kV Lunidhar SS",
        "66kV Virdi SS",
        "66kV Mota Ankadiya SS",
        "66kV Kuvargadh SS",
        "66kV Hadala SS",
        "66kV Nava Ujala SS",
        "66kV Bhingrad SS",
        "66kV Jarakhiya SS",
        "66kV Charkha SS",
        "66kV Ranuja SS",
        "66kV Bhildi SS",
        "66kV Chakkargadh SS",
        "66kV Shekhpipariya SS",
        "66kV Bhoringada SS",
        "66kV Nana Machiyala SS",
        "66kV Luvariya SS",
        "66kV Suryapratapgadh SS",
        "66kV Dahithara SS",
        "66kV Ishwariya SS",
        "66kV Kariyana SS"
    ];
    substations.forEach(ss=>{
        const ssName = ss;
        const feeders = resfeeder.data.filter(f => f.substation_name === ssName);
        
        feeders.forEach(feeder=>{
            try{
                data19max = map19[ssName][feeder.feeder_name].max_amp;
                data19time = map19[ssName][feeder.feeder_name].time;
                html += `
                    <tr>
                        <td>${ssName}</td>
                        <td>${feeder.feeder_name}</td>
                        <td>${data19max}</td>
                        <td>${data19time}</td>`;
            }catch{
                html += `
                    <tr>
                        <td>${ssName}</td>
                        <td>${feeder.feeder_name}</td>
                        <td></td>
                        <td></td>`;
            }
            try{
                data24mwh = map24[ssName][feeder.feeder_name].sent_out;
                html+=`
                        <td>${data24mwh}</td>
                        <td></td>
                    </tr>
                `;
            } catch{
                html += `
                        <td></td>
                        <td></td>
                    </tr>
                `;
            }
        });
        try{
            html += `
                <tr>
                    <td>${ssName}</td>
                    <td>Station</td>
                    <td></td>
                    <td></td>
                    <td>${mapstation[ssName].sent_out}</td>
                    <td>${maplv[ssName].sent_out}</td>
                </tr>
            `;
        } catch{
            html += `
                <tr>
                    <td>${ssName}</td>
                    <td>Station</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            `;
        }
    });
    table.innerHTML = html;

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.table_to_sheet(table);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `LMU report ${date}.xlsx`);
}
async function downloadvoltage(date) {
    if (!date) { alert("Please select a date first."); return; }
    const { data, error } = await supabaseClient
        .from('voltdet19hrs')
        .select('*')
        .eq('date',date);

    if (error) {
        alert("Error fetching data for export");
        return;
    } else{
        const worksheet = XLSX.utils.json_to_sheet(data);

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Voltage_Report");

        XLSX.writeFile(workbook, `Volatge_Amreli_Report_${date}.xlsx`);
    }
}
async function downloadcapacitor(date) {
    if (!date) { alert("Please select a date first."); return; }
    const { data, error } = await supabaseClient
        .from('capdet19hrs')
        .select('*')
        .eq('date',date);
    if (error) {
        alert("Error fetching data for export");
        return;
    } else {
        const worksheet = XLSX.utils.json_to_sheet(data);

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Capacitor_Report");

        XLSX.writeFile(workbook, `Capacitor_Amreli_Report_${date}.xlsx`);
    }
}
async function downloadline(date) {
    if (!date) { alert("Please select a date first."); return; }
    const { data, error } = await supabaseClient
        .from('linedet24hrs')
        .select('*')
        .eq('date',date);
    if (error) {
        alert("Error fetching data for export");
        return;
    } else {
        let table = document.getElementById('my-table');
        let html = `
            <tr>
                <td>Substation Name</td>
                <td>Line Name</td>
                <td>Import</td>
                <td>Export</td>
            </tr>
        `;
        const transmissionLines = [
            "66kV S.kundla(220kV)- Chalala-1 Line",
            "66kV S.kundla(220kV) - Chalala-2 Line",
            "66kV Chalala - Hudli (Dhari) Line",
            "220kV S.kundla - Simran Line",
            "66kV M/s.APPL - Simran Line",
            "66kV Machiyala(400kV Amreli) - Amreli - A Line",
            "66kV Machiyala(400kV)- Nana Machiyala (Sedubhar) Line",
            "66kV Machiyala(400kV Amreli) - Lunidhar Line",
            "66kV Lunidhar-Ishwariya Line",
            "66kV Machiyala(400kV Amreli)- Malaviya Pipariya Line",
            "66kV Machiyala(400kV Amreli) - Ankadiya Line",
            "66kV Lunidhar-Devgam Line",
            "66kV Lunidhar-Vena Windfarm",
            "66kV Machiyala(400kV Amreli)- Gavadka (Amreli-C) Line",
            "66kV Vadiya - Tori Line",
            "66kV Derdi-Ranuja Line",
            "66kV Sultanpur-Ranuja Line",
            "66kV Bagasara - Paryapat",
            "66kV Chavand - Babara Line",
            "66kV Machiyala(400kV Amreli)- Chittal Line",
            "66kV Charkha - Nadala Line",
            "66kV Nadala - Kotdapitha Line",
            "66kV SEPC- Kotdapitha Line-1",
            "66kV SEPC- Kotdapitha Line-2",
            "66kV Theoliya 1 - Khambhala Line",
            "66kV Theoliya 2 - Khambhala Line",
            "66kV Kuvaragadh- Vena",
            "66kV KJV EXP Line 1",
            "66kV KJV EXP Line 2",
            "66kV Khambhala - Bhadli Line",
            "66kV Jivapar-kotdapitha line",
            "66kV S.kundla(220kV) - Liliya Line",
            "66kV S.kundla(220kV) - Bhoringada Line",
            "66kV Dhasa (220kV) - Dahithara Line",
            "66kV Dhasa (220kV) - Bhingrad Line",
            "66kV Hadala-Mavjinjava Sauni Yojana EHT",
            "66kV Machiyala(400kV Amreli)-Ishwariya Line",
            "66kV Kariyana-Rojmal Line",
            "66kV Kariyana-Khambhala(Sauni Yojana) Line"
        ];
        
        transmissionLines.forEach(line=>{
            try{   
                const lineName = line;
                const linedata = data.filter(f => f.line_name === lineName);
                html+=`
                    <tr>
                    <td>${linedata[0].substation_name}</td>
                    <td>${linedata[0].line_name}</td>
                    <td>${linedata[0].import}</td>
                    <td>${linedata[0].export}</td>
                </tr>
                `;
            } catch{
                html+=`
                    <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                `;
            }
        });
        table.innerHTML = html;
        
        const worksheet = XLSX.utils.table_to_sheet(table);

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Line_Report");
        
        XLSX.writeFile(workbook, `Line_Amreli_Report_${date}.xlsx`);
    }
}
async function check19(date) {
    const { data, error } = await supabaseClient
        .from('voltdet19hrs')
        .select('substation_name')
        .eq('date',date)
    if(error){
        console.log('Error Occured while checking 19Hrs');
    } else{
        return data;
    }
}
async function check24(date) {
    const { data, error } = await supabaseClient
        .from('lmudet24hrs')
        .select('substation_name')
        .eq('date',date)
        .eq('feeder_name','LV Total')
    if(error){
        console.log('Error Occured while checking 24Hrs');
    } else{
        return data;
    }
}
async function getstatus() {
    let date = document.getElementById('gen-date').value;
    let statusTable = document.querySelector('.status-table');

    statusTable.innerHTML = `
        <tr>
            <th>Substation Name</th>
            <th>19Hrs</th>
            <th>24Hrs</th>
        </tr>
    `;

    try {
        const [data19, data24] = await Promise.all([
            check19(date),
            check24(date)
        ]);

        const ss_done19 = data19.map(ss => ss.substation_name);
        const ss_done24 = data24.map(ss => ss.substation_name);
        
        let databb = datass.map(ss => ss.substation_name);
        
        databb.forEach(ss => {
            let ss_row = document.createElement('tr');
            
            let ss_name_td = document.createElement('td');
            ss_name_td.innerHTML = ss;
            ss_row.appendChild(ss_name_td);

            let ss_19_td = document.createElement('td');
            ss_19_td.innerHTML = ss_done19.includes(ss) ? '🟢' : '🔴';
            ss_row.appendChild(ss_19_td);

            let ss_24_td = document.createElement('td');
            ss_24_td.innerHTML = ss_done24.includes(ss) ? '🟢' : '🔴';
            ss_row.appendChild(ss_24_td);

            statusTable.appendChild(ss_row);
        });

    } catch (error) {
        console.error("Status check failed:", error);
        alert("Could not load substation status.");
    }
}