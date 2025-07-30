// Copyright (c) 2025, Samiul Sakib and contributors
// For license information, please see license.txt

frappe.ui.form.on('Vehicle Details', {
        refresh: function (frm) {
        
        frm.clear_custom_buttons();

        if (!frm.doc.chassis_number) return;

        frappe.call({
            method: "vehicle_management.api.get_related_docs_status",
            args: {
                chassis_no: frm.doc.chassis_number
            },
            callback: function (r) {
                if (!r.message) return;
                

                const status = r.message.status;
                const missing = r.message.missing || [];

                frm.set_value("status", status);

                frm.save();

                if (missing.length > 0) {
                    missing.forEach(item => {
                        frm.add_custom_button(item, function () {
                            frappe.new_doc(item ,{
                                chassis_no: frm.doc.chassis_number
                            });
                        }, "Create");
                    });
                }
            }
        });
    }
});

// frappe.ui.form.on('Vehicle Details', {
    // refresh(frm) {
    //     if (!frm.is_new()) {
    //         const chassis = String(frm.doc.chassis_number || '').trim();

    //         // --- Vehicle Availability Button ---
    //         frm.add_custom_button(__('Vehicle Availability'), () => {
    //             if (!chassis) {
    //                 frappe.msgprint(__('Chassis Number is not set.'));
    //                 return;
    //             }

    //             frappe.db.get_value('Vehicle Availability', { chassis_no: chassis }, 'name').then(res => {
    //                 if (res.message?.name) {
    //                     frappe.set_route('Form', 'Vehicle Availability', res.message.name);
    //                 } else {
    //                     frappe.new_doc('Vehicle Availability', {
    //                         chassis_no: chassis
    //                     });
    //                 }
    //             });
    //         }, __('Create'));

    //         // --- Vehicle Price Button ---
    //         frm.add_custom_button(__('Vehicle Price'), () => {
    //             if (!chassis) {
    //                 frappe.msgprint(__('Chassis Number is not set.'));
    //                 return;
    //             }

    //             frappe.db.get_value('Vehicle Price', { chassis_no: chassis }, 'name').then(res => {
    //                 if (res.message?.name) {
    //                     frappe.set_route('Form', 'Vehicle Price', res.message.name);
    //                 } else {
    //                     frappe.new_doc('Vehicle Price', {
    //                         chassis_no: chassis,
    //                         car_name: frm.doc.car_model
    //                     });
    //                 }
    //             });
    //         }, __('Create'));
    //     }
    // },




 function set_next_review_id(frm, cdt, cdn) {
  const title = frm.doc.title || frm.doc.name || "";
  const words = title.trim().split(/\s+/);

  let prefix = "DOC";

  if (words.length === 1) {
    prefix = words[0].slice(0, 3).toUpperCase();
  } else if (words.length >= 2) {
    const prefix1 = words[0].slice(0, 3).toUpperCase();
    const prefix2 = words[1].slice(0, 3).toUpperCase();
    prefix = `${prefix1}-${prefix2}`;
  }

  const rows = frm.doc.document_reviewers || [];
  let max_num = 1000;

  rows.forEach((row) => {
    if (row.review_id && row.review_id.startsWith(`REV-${prefix}-`)) {
      const num = parseInt(row.review_id.split("-").pop());
      if (!isNaN(num) && num > max_num) {
        max_num = num;
      }
    }
  });

  const next_id = `REV-${prefix}-${max_num + 1}`;
  frappe.model.set_value(cdt, cdn, "review_id", next_id);
}
