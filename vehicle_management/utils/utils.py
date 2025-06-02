import frappe
from num2words import num2words

@frappe.whitelist()
def get_money_in_words(number):
    # Convert number to words using Indian English locale
    words = num2words(number, lang='en_IN').replace(',', '')

    # Capitalize first letter, add currency suffix
    result = f"{words[0].upper() + words[1:]} Taka Only"

    return result
