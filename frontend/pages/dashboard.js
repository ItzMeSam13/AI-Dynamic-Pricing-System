import React from 'react';

const Dashboard =() => {
    return (
    <div className="flex flex-col min-h-screenbbg-grey-100">
    <nav className="bg-blue-600 text-white p-4 flex justify-between iteams-center">
    <h1 className="text-xl font-bold">Dashboard</h1>
    <button className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600">Log Out</button>
    </nav>
    <div clssName="flex flex-1">
    <aside className="w-64 bg-white shadow-md p-4">
        <ul>
            <li className="py-2 hover:bg-gray-200 rounded-md cursor-pointer">Profile</li>
            <li className="py-2 hover:bg-gray-200 rounded-md cursor-pointer">Settings</li>
            <li className="py-2 hover:bg-gray-200 rounded-md cursor-pointer">Analytics</li>
        </ul>
        </aside>
    <main className="flex-1 p-6">
        <h2 className="text-2xl font-semibold">WELCOME TO DASHBOARD</h2>
        <p className="mt-2 text-gray-600">Manage your account and settings here.</p>
    </main>
    </div>
    </div>
    );
};

export default Dashboard; 