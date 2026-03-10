const _supabaseUrl = 'https://dbmosmqilzwwhbqkwczk.supabase.co';
const _supabaseKey = 'sb_publishable_8AQWinPIQ7aMsWK0lqTI2g_M52Fkj_2';
const supabaseClient = supabase.createClient(_supabaseUrl, _supabaseKey);

let x1 = false;
let x2 = false;

let t1 = true;
let t2 = false;

let datass = [];

getAllSubstations().then(data =>{
    let ssoptions = document.getElementById('ss-dropdown');
    ssoptions.innerHTML = '';
    let ssoptions2 = document.getElementById('ss-dropdown2');
    ssoptions2.innerHTML = '';
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
    let arrow = document.getElementById('menu1');
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
    const { data, error } = await supabase
        .from('lmudet19hrs')
        .select('*')
        .eq('date',date);

    if (error) {
        alert("Error fetching data for export");
        return;
    }

    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "LMU_Report_19");

    const { data1, error1 } = await supabase
        .from('lmudet24hrs')
        .select('*')
        .eq('date',date);

    if (error1) {
        alert("Error fetching data for export");
        return;
    }

    const worksheet1 = XLSX.utils.json_to_sheet(data1);

    XLSX.utils.book_append_sheet(workbook, worksheet1, "LMU_Report_24");

    XLSX.writeFile(workbook, `LMU_Amreli_Report_${date}.xlsx`);
}
async function downloadvoltage(date) {
    const { data, error } = await supabase
        .from('voltdet19hrs')
        .select('*')
        .eq('date',date);

    if (error) {
        alert("Error fetching data for export");
        return;
    }

    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Voltage_Report");

    XLSX.writeFile(workbook, `Volatge_Amreli_Report_${date}.xlsx`);
}