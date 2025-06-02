// Copyright (c) 2025, Samiul Sakib and contributors
// For license information, please see license.txt


frappe.query_reports["Vehicle Report"] = {
    "filters": [
        
        {
            "fieldname": "chassis_no",
            "label": "Chassis No",
            "fieldtype": "Link",
            "options": "Vehicle Details",
            "reqd": 0
        },
        {
            "fieldname": "car_model",
            "label": "Car Model",
            "fieldtype": "Link",
            "options": "Car Model",
            "reqd": 0
        },
        {
            "fieldname": "model_year",
            "label": "Model Year",
            "fieldtype": "Link",
            "options": "Model Year",
            "reqd": 0
        },
        {
            "fieldname": "auction_grade",
            "label": "Auction Grade",
            "fieldtype": "Link",
            "options": "Auction Grade",
            "reqd": 0
        },
        {
            "fieldname": "color",
            "label": "Color",
            "fieldtype": "Link",
            "options": "Color",
            "reqd": 0
        },
        {
            "fieldname": "status",
            "label": "Vehicle Status",
            "fieldtype": "Link",
            "options": "Vehicle Status",
            "reqd": 0
        },  
        {
            "fieldname": "from_date",
            "label": "From Date",
            "fieldtype": "Date",
            "default": frappe.datetime.add_days(frappe.datetime.nowdate(), -30)
        },
        {
            "fieldname": "to_date",
            "label": "To Date",
            "fieldtype": "Date",
            "default": frappe.datetime.nowdate()
        }
    ],

    // onload: function(report) {
    //     // Optional: Set default values or add custom buttons here
    //     frappe.msgprint("Welcome to the Vehicle Report!");
    // }
};
