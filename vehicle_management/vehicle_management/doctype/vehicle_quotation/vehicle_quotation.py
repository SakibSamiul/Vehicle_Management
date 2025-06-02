# Copyright (c) 2025, Samiul Sakib and contributors
# For license information, please see license.txt

import frappe

from frappe.model.document import Document
from frappe.utils import flt, money_in_words

class VehicleQuotation(Document):

    def before_save(self):
        self.calculate_totals()

    def calculate_totals(self):
        total_amount = 0

        # Use the actual child table fieldname here!
        for row in self.vehicle_info:
            # assuming your child DocType fields include unit, unit_price, amount
            row.amount = flt(row.unit) * flt(row.unit_price)
            total_amount += row.amount

        self.total_amount = total_amount
        self.in_words = money_in_words(total_amount)
