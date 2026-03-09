const _supabaseUrl = 'https://dbmosmqilzwwhbqkwczk.supabase.co';
const _supabaseKey = 'sb_publishable_8AQWinPIQ7aMsWK0lqTI2g_M52Fkj_2';
const supabaseClient = supabase.createClient(_supabaseUrl, _supabaseKey);

async function Login(user, pass) {
    
    const { data, error } = await supabaseClient
        .from('users') 
        .select('id, username, substation_name')
        .eq('username', user)
        .eq('password', pass);
    if (error) {
        console.error("Database error:", error.message);
        alert("An error occurred during login. Please try again.");
        return;
    } 
    if (data.length > 0) {
        console.log("Login successful!");
        localStorage.setItem('logged_in_user', JSON.stringify(data[0]));
        window.location.href = 'substation.html';
    } else {
        alert("Invalid Username or Password.");
    }
}

function handleLogin() {
    const userName = document.getElementById('username').value;
    const passWord = document.getElementById('password').value;
    
    if(!userName || !passWord) {
        alert("Please enter both username and password");
        return;
    } else if(userName=='Admin'&&passWord=='Nodal@12345'){
        window.location.href = 'adminpanel.html';
        return;
    }
    Login(userName, passWord);
}