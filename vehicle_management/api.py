# vehicle_management/vehicle_management/api.py

# import frappe

# @frappe.whitelist()
# def get_related_docs_status(chassis_no):
#     has_availability = frappe.db.exists("Vehicle Availability", {"chassis_no": chassis_no})
#     has_price = frappe.db.exists("Vehicle Price", {"chassis_no": chassis_no})

#     if has_availability and has_price:
#         return {"status": "Completed"}
#     elif has_availability:
#         return {"status": "To Add Vehicle Price"}
#     elif has_price:
#         return {"status": "To Add Vehicle Availability"}
#     else:
#         return {"status": "To Add Vehicle Availability and Vehicle Price"}


# import frappe

# @frappe.whitelist()
# def get_related_docs_status(chassis_no):
#     status = "To Add Vehicle Availability and Vehicle Price"
#     missing = []

#     has_availability = frappe.db.exists("Vehicle Availability", {"chassis_no": chassis_no})
#     has_price = frappe.db.exists("Vehicle Price", {"chassis_no": chassis_no})

#     if has_availability and has_price:
#         status = "Completed"
#     elif has_availability:
#         status = "To Add Vehicle Price"
#         missing.append("Vehicle Price")
#     elif has_price:
#         status = "To Add Vehicle Availability"
#         missing.append("Vehicle Availability")
#     else:
#         missing.extend(["Vehicle Availability", "Vehicle Price"])

#     return {
#         "status": status,
#         "missing": missing
#     }


# import frappe

# @frappe.whitelist()
# def get_related_docs_status(chassis_no):
#     has_availability = frappe.db.exists("Vehicle Availability", {"chassis_no": chassis_no})
#     has_price = frappe.db.exists("Vehicle Price", {"chassis_no": chassis_no})

#     if has_availability and has_price:
#         return {"status": "Completed", "missing": []}
#     elif has_availability:
#         return {"status": "To Add Vehicle Price", "missing": ["Vehicle Price"]}
#     elif has_price:
#         return {"status": "To Add Vehicle Availability", "missing": ["Vehicle Availability"]}
#     else:
#         return {"status": "To Add Vehicle Availability and Vehicle Price", "missing": ["Vehicle Availability", "Vehicle Price"]}


import frappe

@frappe.whitelist()
def get_related_docs_status(chassis_no):
    has_availability = frappe.db.exists("Vehicle Availability", {"chassis_no": chassis_no})
    has_price = frappe.db.exists("Vehicle Price", {"chassis_no": chassis_no})

    if has_availability and has_price:
        return {"status": "Completed", "missing": []}
    elif has_availability:
        return {"status": "To Add Vehicle Price", "missing": ["Vehicle Price"]}
    elif has_price:
        return {"status": "To Add Vehicle Availability", "missing": ["Vehicle Availability"]}
    else:
        return {
            "status": "To Add Vehicle Availability and Vehicle Price",
            "missing": ["Vehicle Availability", "Vehicle Price"]
        }
