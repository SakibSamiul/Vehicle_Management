# Copyright (c) 2025, Samiul Sakib and Contributors
# See license.txt

from frappe import _

def get_data():
    return {
        "fieldname": "vehicle_price",
        "transactions" : [
            {"label": _("Reference"), "items": ["Vehicle Availability"]},
        ]
    }