const _supabaseUrl = 'https://dbmosmqilzwwhbqkwczk.supabase.co';
const _supabaseKey = 'sb_publishable_8AQWinPIQ7aMsWK0lqTI2g_M52Fkj_2';
const supabaseClient = supabase.createClient(_supabaseUrl, _supabaseKey);

let x1 = false;
let x2 = false;

getAllSubstations().then(data =>{
    let ssoptions = document.getElementById('ss-dropdown');
    ssoptions.innerHTML = '';
    data.forEach(ss_name => {
        let newoption = document.createElement('option');
        newoption.innerHTML = ss_name;
        newoption.setAttribute('value', ss_name);
        ssoptions.appendChild(newoption);
    });
});

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
    }
}

function expandadss(){
    let e1 = document.querySelector('.a1');
    let btn = document.querySelector('.addssbutton');
    if (x1 == false){
        e1.classList.remove('f1');
        btn.innerHTML = '&#8595 Add New Substation';
        x1 = true;
    } else if (x1 == true){
        e1.classList.add('f1');
        btn.innerHTML = '&#8594 Add New Substation';
        x1 = false;
    }
}

function expandadfeeder(){
    let e2 = document.querySelector('.a2');
    let btn = document.querySelector('.addfeederbutton');
    if (x2 == false){
        e2.classList.remove('f2');
        btn.innerHTML = '&#8595 Add New Feeder';
        x2 = true;
    } else if (x2 == true){
        e2.classList.add('f2');
        btn.innerHTML = '&#8594 Add New Feeder';
        x2 = false;
    }
}

async function getAllSubstations() {
    const { data, error } = await supabaseClient
        .from('users')
        .select('substation_name');
    if (error) {
        console.error('Error fetching substations:', error.message);
        return;
    }
    const namesOnly = data.map(item => item.substation_name);
    return namesOnly;
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

/*
async function deleterow(rowid){
    const {data, error}= await supabaseClient.from('users').delete().eq('substation_id',rowid);
    if (error) {
        console.error('Error deleting:', error.message);
    } else {
        console.log('Row deleted successfully');
    }
}

function deleted(ssId){
    deleterow(ssId);
    let tableBody = document.getElementById('mgmt-table');
    let rowDel = document.querySelector(`.a${ssId}`);
    tableBody.removeChild(rowDel);
}*/
