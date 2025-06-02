# Copyright (c) 2025, Samiul Sakib and Contributors
# See license.txt

from frappe import _

def get_data():
    return {
        "fieldname": "chassis_no",
        "transactions" : [
            {"label": _("Related"), "items": ["Vehicle Price"]},
        ]
    }