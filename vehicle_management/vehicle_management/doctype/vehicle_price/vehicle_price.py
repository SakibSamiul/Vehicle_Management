# Copyright (c) 2025, Samiul Sakib and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import flt, money_in_words

class VehiclePrice(Document):
    def before_save(self):
        self.calculate_totals()

    def calculate_totals(self):
        total_qty = 0
        total_amt = 0

        # Use the correct child table fieldname (as per your DocType)
        for item in self.other_vehicle_name:
            item.amount = flt(item.qty) * flt(item.rate)
            total_qty += flt(item.qty)
            total_amt += item.amount

        self.total_quantity = total_qty
        self.total_amount = total_amt

        self.sale_price = flt(self.company_price) + flt(self.customer_price)
        self.grand_total = self.sale_price + self.total_amount

        # Convert to words
        self.in_words = money_in_words(self.grand_total)
