// Copyright (c) 2025, Samiul Sakib and contributors
// For license information, please see license.txt

frappe.ui.form.on('Vehicle Quotation', {
    refresh: function(frm) {
        
        if (!frm.doc.vehicle_info || frm.doc.vehicle_info.length === 0) {
            let row = frm.add_child('vehicle_info');
            frm.refresh_field('vehicle_info');
            
        }
        
        if (frm.doc.vehicle_info && frm.doc.vehicle_info.length > 0) {
            let first_row = frm.doc.vehicle_info[0];
            console.log("Color:", first_row.color || "");
            console.log("Country:", first_row.country || "");
            console.log("Model:", first_row.model || "");
            console.log("Seating Capacity:", first_row.seating_capacity || "");
        }
    }
});

frappe.ui.form.on('Vehicle Quotation Info', {
    chassis_no: function(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        if (!row.chassis_no) return;


        // Fetch sale_price from Vehicle Price
        frappe.call({
            method: "frappe.client.get_list",
            args: {
                doctype: "Vehicle Price",
                filters: { chassis_no: row.chassis_no },
                fields: ["sale_price"],
                limit_page_length: 1
            },
            callback: function(res) {
                if (res.message && res.message.length > 0) {
                    // let price = res.message[0].sale_price || 0;
                    let price = parseFloat(res.message[0].sale_price) || 0;
                    frappe.model.set_value(cdt, cdn, "unit_price", price);
                    frappe.model.set_value(cdt, cdn, "unit", row.unit || 1);
                    frappe.model.set_value(cdt, cdn, "amount", price * (row.unit || 1));
                    update_child_in_words(frm, cdt, cdn);
                } else {
                    frappe.msgprint("No Vehicle Price found for this chassis.");
                }
            }
        });
    },

    unit: function(frm, cdt, cdn) {
        calculate_row_total(frm, cdt, cdn);
    },

    unit_price: function(frm, cdt, cdn) {
        calculate_row_total(frm, cdt, cdn);
    }
});

function calculate_row_total(frm, cdt, cdn) {
    const row = locals[cdt][cdn];

    const unit_price = parseFloat(row.unit_price) || 0;
    const unit = parseInt(row.unit) || 0;
    const total = unit_price * unit;

    frappe.model.set_value(cdt, cdn, "amount", total);
    update_child_in_words(frm, cdt, cdn);

    frm.refresh_field("vehicle_info");

}

function update_child_in_words(frm, cdt, cdn) {
    const row = locals[cdt][cdn];
    frappe.call({
        method: 'vehicle_management.utils.utils.get_money_in_words',
        args: { number: row.unit_price },
        callback: r => {
            if (r.message) {
                frappe.model.set_value(cdt, cdn, 'in_words', r.message);
            }
        }
    }); 
}

