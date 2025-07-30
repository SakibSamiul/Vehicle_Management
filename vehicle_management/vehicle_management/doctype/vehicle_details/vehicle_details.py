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

	
		
	def generate_review_ids(self):
        prefix = self.get_prefix()

        # the highest number used so far
        max_num = 1000
        for row in self.document_reviewers:
            if row.review_id and row.review_id.startswith(f"REV-{prefix}-"):
                try:
                    num = int(row.review_id.rsplit("-", 1)[-1])
                    if num > max_num:
                        max_num = num
                except ValueError:
                    continue

        # Set new review_id for rows 
        counter = max_num + 1
        for row in self.document_reviewers:
            if not row.review_id:
                row.review_id = f"REV-{prefix}-{counter}"
                counter += 1

    def get_prefix(self):
        """
        Returns a prefix based on the first two words of title or name.
        Example:
        - "Tax Settings" → "TAX-SET"
        - "Payroll" → "PAY"
        """
        title = (self.title or self.name or "").strip()
        words = title.split()

        if len(words) == 1:
            return words[0][:3].upper()
        else:
            part1 = words[0][:3].upper()
            part2 = words[1][:3].upper()
            return f"{part1}-{part2}"




