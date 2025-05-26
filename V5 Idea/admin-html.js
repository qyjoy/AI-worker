// src/admin/admin-html.js

export function renderAdminLoginForm(errorMessage = '') {
    // This is just a basic login form, could be part of the main app's login if desired
    return `
        <!DOCTYPE html><html><head><title>Admin Login</title>
        <style> body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f0f0f0; } form { background: white; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1); } input { display: block; margin-bottom: 10px; padding: 8px; width: 200px; } button { padding: 10px; background: #007bff; color: white; border: none; cursor: pointer; } .error { color: red; margin-bottom: 10px; }</style>
        </head><body>
        <form method="POST" action="/auth/login?redirect=/admin"> <!-- Assuming login handler redirects -->
            <h2>Admin Login</h2>
            ${errorMessage ? `<p class="error">${errorMessage}</p>` : ''}
            <input type="email" name="email" placeholder="Email" required>
            <input type="password" name="password" placeholder="Password" required>
            <button type="submit">Login</button>
        </form>
        </body></html>
    `;
}


export function renderAdminPage(data) {
    const { users = [], apiKeys = [], modelCosts = [], appSettings = [], csrfToken } = data;

    // Helper to render form for a setting
    const renderSettingForm = (setting) => `
        <form method="POST" action="/admin/settings/update" class="setting-form">
            <input type="hidden" name="csrf_token" value="${csrfToken}">
            <input type="hidden" name="setting_key" value="${setting.setting_key}">
            <label for="${setting.setting_key}">${setting.description || setting.setting_key}:</label>
            <input type="text" id="${setting.setting_key}" name="setting_value" value="${setting.setting_value}">
            <button type="submit">Update</button>
        </form>
    `;
    
    // Helper to render API Key form
    const renderApiKeyRow = (key) => `
        <tr>
            <td>${key.id}</td>
            <td><input type="text" name="line_name_${key.id}" value="${key.line_name}"></td>
            <td><input type="text" name="api_key_value_${key.id}" value=" partiellement masqué..." title="${key.api_key_value}"></td> <!-- Mask key -->
            <td><input type="checkbox" name="is_active_${key.id}" ${key.is_active ? 'checked' : ''}></td>
            <td><input type="text" name="notes_${key.id}" value="${key.notes || ''}"></td>
            <td>
                <button formaction="/admin/apikeys/update/${key.id}">Update</button>
                <button formaction="/admin/apikeys/delete/${key.id}" class="delete">Delete</button>
            </td>
        </tr>
    `;


    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Panel</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; background-color: #f4f7f6; color: #333; }
            h1, h2 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; background-color: white; box-shadow: 0 2px 3px rgba(0,0,0,0.1); }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #3498db; color: white; }
            tr:nth-child(even) { background-color: #ecf0f1; }
            .setting-form, .form-section { margin-bottom: 20px; padding: 15px; background-color: white; border-radius: 5px; box-shadow: 0 2px 3px rgba(0,0,0,0.1); }
            .setting-form label { display: inline-block; width: 300px; margin-bottom: 5px; }
            .setting-form input[type="text"], .form-section input[type="text"], .form-section input[type="password"], .form-section textarea {
                padding: 8px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 3px; width: calc(100% - 20px);
            }
            button { padding: 10px 15px; background-color: #3498db; color: white; border: none; border-radius: 3px; cursor: pointer; transition: background-color 0.3s; }
            button:hover { background-color: #2980b9; }
            button.delete { background-color: #e74c3c; }
            button.delete:hover { background-color: #c0392b; }
            nav { margin-bottom:20px; }
            nav a { margin-right: 15px; text-decoration: none; color: #3498db; font-weight: bold; }
        </style>
    </head>
    <body>
        <h1>Admin Panel</h1>
        <nav><a href="/">Back to Chat</a> | <a href="/auth/logout" onclick="event.preventDefault(); document.getElementById('logout-form').submit();">Logout</a></nav>
        <form id="logout-form" action="/auth/logout" method="POST" style="display: none;"><input type="hidden" name="csrf_token" value="${csrfToken}"></form>

        <h2>App Settings</h2>
        <div class="form-section">
            ${appSettings.map(renderSettingForm).join('')}
        </div>

        <h2>User Management (Read-only example)</h2>
        <table>
            <thead><tr><th>ID</th><th>Email</th><th>Coins</th><th>Role</th><th>Created At</th></tr></thead>
            <tbody>
                ${users.map(user => `<tr><td>${user.id}</td><td>${user.email}</td><td>${user.coins}</td><td>${user.role}</td><td>${new Date(user.created_at).toLocaleString()}</td></tr>`).join('')}
            </tbody>
        </table>
        
        <h2>API Keys</h2>
        <form method="POST"> <!-- This form can target different actions with formaction on buttons -->
            <input type="hidden" name="csrf_token" value="${csrfToken}">
            <table>
                <thead><tr><th>ID</th><th>Line Name</th><th>API Key Value</th><th>Active</th><th>Notes</th><th>Actions</th></tr></thead>
                <tbody>
                    ${apiKeys.map(renderApiKeyRow).join('')}
                    <tr> <!-- Form for adding new key -->
                        <td>New:</td>
                        <td><input type="text" name="line_name" placeholder="e.g., Line 3 - Backup" required></td>
                        <td><input type="password" name="api_key_value" placeholder="Enter API Key" required></td>
                        <td><input type="checkbox" name="is_active" checked></td>
                        <td><textarea name="notes" placeholder="Optional notes"></textarea></td>
                        <td><button type="submit" formaction="/admin/apikeys/add">Add Key</button></td>
                    </tr>
                </tbody>
            </table>
        </form>

        <h2>Model Costs</h2>
        <form method="POST" action="/admin/modelcosts/update" class="form-section">
             <input type="hidden" name="csrf_token" value="${csrfToken}">
            ${modelCosts.map(cost => `
                <div>
                    <label for="cost_${cost.model_name}">${cost.model_name}:</label>
                    <input type="number" id="cost_${cost.model_name}" name="cost_${cost.model_name}" value="${cost.cost_per_request}" min="0">
                </div>
            `).join('')}
            <p><small>To add a new model, edit an existing one in D1 or add UI for it.</small></p>
            <button type="submit">Update Costs</button>
        </form>
        
        <script>
            // Basic client-side JS for admin panel can go here if needed
            // e.g., confirm on delete
            document.querySelectorAll('button.delete').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    if (!confirm('Are you sure you want to delete this item?')) {
                        e.preventDefault();
                    }
                });
            });
        </script>
    </body>
    </html>
    `;
}