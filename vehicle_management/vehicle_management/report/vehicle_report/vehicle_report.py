# Copyright (c) 2025, Samiul Sakib and contributors
# For license information, please see license.txt

import frappe

def execute(filters=None):
    columns = [
        {"label": "Chassis No", "fieldname": "chassis_no", "fieldtype": "Link", "options": "Vehicle Details", "width": 150},
        {"label": "Car Model", "fieldname": "car_model", "fieldtype": "Data", "width": 120},
        {"label": "Model Year", "fieldname": "model_year", "fieldtype": "Data", "width": 100},
        {"label": "Shape", "fieldname": "shape", "fieldtype": "Data", "width": 100},
        {"label": "Auction Grade", "fieldname": "auction_grade", "fieldtype": "Data", "width": 120},
        {"label": "Package", "fieldname": "package", "fieldtype": "Data", "width": 120},
        {"label": "Color", "fieldname": "color", "fieldtype": "Data", "width": 100},
        {"label": "Milage", "fieldname": "milage", "fieldtype": "Float", "width": 100},
        {"label": "CC", "fieldname": "cc", "fieldtype": "Float", "width": 80},
        {"label": "Seat Capacity", "fieldname": "seat_capacity", "fieldtype": "Int", "width": 100},
        {"label": "Origin Country", "fieldname": "origin_country", "fieldtype": "Data", "width": 120},
        {"label": "Vehicle Status", "fieldname": "status", "fieldtype": "Data", "width": 120},
        {"label": "Sale Price", "fieldname": "sale_price", "fieldtype": "Currency", "width": 120},
        {"label": "Grand Total", "fieldname": "grand_total", "fieldtype": "Currency", "width": 120},
    ]

    conditions = []
    if filters.get("chassis_no"):
        conditions.append("vd.name = %(chassis_no)s")
    if filters.get("car_model"):
        conditions.append("vd.car_model = %(car_model)s")
    if filters.get("model_year"):
        conditions.append("vd.model_year = %(model_year)s")
    if filters.get("auction_grade"):
        conditions.append("vd.auction_grade = %(auction_grade)s")
    if filters.get("color"):
        conditions.append("vd.color = %(color)s")
    if filters.get("status"):
        conditions.append("va.status = %(status)s")
        
    if filters.get("from_date"):
        conditions.append("vp.posting_date >= %(from_date)s")
    if filters.get("to_date"):
        conditions.append("vp.posting_date <= %(to_date)s")

    where_clause = " AND ".join(conditions)
    if where_clause:
        where_clause = "WHERE " + where_clause

    data = frappe.db.sql(f"""
        SELECT
            vd.name as chassis_no,
            vd.car_model,
            vd.model_year,
            vd.shape,
            vd.auction_grade,
            vd.package,
            vd.color,
            vd.milage,
            vd.cc,
            vd.seat_capacity,
            vd.origin_country,
            va.status,
            vp.sale_price,
            vp.grand_total
        FROM `tabVehicle Details` vd
        LEFT JOIN `tabVehicle Price` vp ON vp.chassis_no = vd.name
        LEFT JOIN `tabVehicle Availability` va ON va.chassis_no = vd.chassis_number
        {where_clause}
    """, filters, as_dict=True)

    return columns, data
