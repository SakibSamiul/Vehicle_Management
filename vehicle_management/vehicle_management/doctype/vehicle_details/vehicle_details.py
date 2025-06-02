# Copyright (c) 2025, Samiul Sakib and contributors
# For license information, please see license.txt


import frappe
from frappe.model.document import Document

class VehicleDetails(Document):
    def validate(self):
        self.update_status()

    def update_status(self):
        # Check if related documents exist
        availability_exists = frappe.db.exists("Vehicle Availability", {"chassis_no": self.chassis_number})
        price_exists = frappe.db.exists("Vehicle Price", {"chassis_no": self.chassis_number})

        # set status based on what exists
        if not availability_exists and not price_exists:
            self.status = "To Add Vehicle Availability and Vehicle Price"
        elif not availability_exists:
            self.status = "To Add Vehicle Availability"
        elif not price_exists:
            self.status = "To Add Vehicle Price"
        else:
            self.status = "Completed"
