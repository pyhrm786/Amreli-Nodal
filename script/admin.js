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
    let newdata = [];
    const { data, error } = await supabaseClient
        .from('lmudet19hrs')
        .select('*')
        .eq('date',date);
    newdata = data;
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "LMU19_Report");

    if (error) {
        alert("Error fetching data for export");
        return;
    } else{
        const { data, error } = await supabaseClient
            .from('lmudet24hrs')
            .select('*')
            .eq('date',date);

        if (error) {
            alert("Error fetching data for export");
            return;
        } else {
            const worksheet = XLSX.utils.json_to_sheet(data);
            XLSX.utils.book_append_sheet(workbook, worksheet, "LMU24_Report");
        }
    }
    XLSX.writeFile(workbook, `LMU_Amreli_Report_${date}.xlsx`);
}
async function downloadvoltage(date) {
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
    const { data, error } = await supabaseClient
        .from('linedet24hrs')
        .select('*')
        .eq('date',date);
    if (error) {
        alert("Error fetching data for export");
        return;
    } else {
        const worksheet = XLSX.utils.json_to_sheet(data);

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
function getstatus(){
    let date = document.getElementById('gen-date').value;
    let statusTable = document.querySelector('.status-table');
    statusTable.innerHTML = `
        <tr>
            <th>Substation Name</th>
            <th>19Hrs</th>
            <th>24Hrs</th>
        </tr>
    `;
    check19(date).then(ss_done=>{
        ss19_done_names = ss_done.map(ss=>ss.substation_name);
        datass.forEach(ss=>{
            let ss_row = document.createElement('tr');
            let ss_name_td = document.createElement('td');
            ss_name_td.innerHTML = ss.substation_name;
            ss_row.appendChild(ss_name_td);
            let ss_19_td = document.createElement('td');
            if(ss19_done_names.includes(ss.substation_name)){
                ss_19_td.innerHTML = `&#128994`;
            } else{
                ss_19_td.innerHTML = `&#128308`;
            }
            ss_row.appendChild(ss_19_td);
            let ss_24_td = document.createElement('td');
            ss_24_td.innerHTML = '';
            ss_row.appendChild(ss_24_td);

            statusTable.appendChild(ss_row);
        });
    });
}
