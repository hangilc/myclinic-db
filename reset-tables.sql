delete from iyakuhin_master_arch;
delete from no_roujin_techou;
delete from pharma_drug;
delete from pharma_queue;
delete from shinryoukoui_master_arch;
delete from tokuteikizai_master_arch;
delete from visit_charge;
delete from visit_gazou_label;
delete from visit_payment;
delete from wqueue;

delete from disease;
alter table disease auto_increment = 1;
delete from disease_adj;
alter table disease_adj auto_increment = 1;
delete from hoken_koukikourei;
alter table hoken_koukikourei auto_increment = 1;
delete from hoken_roujin;
alter table hoken_roujin auto_increment = 1;
delete from hoken_shahokokuho;
alter table hoken_shahokokuho auto_increment = 1;
delete from hotline;
alter table hotline auto_increment = 1;
delete from kouhi;
alter table kouhi auto_increment = 1;
delete from patient;
alter table patient auto_increment = 1;
delete from presc_example;
alter table presc_example auto_increment = 1;
delete from stock_drug;
alter table stock_drug auto_increment = 1;
delete from visit;
alter table visit auto_increment = 1;
delete from visit_conduct;
alter table visit_conduct auto_increment = 1;
delete from visit_conduct_drug;
alter table visit_conduct_drug auto_increment = 1;
delete from visit_conduct_kizai;
alter table visit_conduct_kizai auto_increment = 1;
delete from visit_conduct_shinryou;
alter table visit_conduct_shinryou auto_increment = 1;
delete from visit_drug;
alter table visit_drug auto_increment = 1;
delete from visit_shinryou;
alter table visit_shinryou auto_increment = 1;
delete from visit_text;
alter table visit_text auto_increment = 1;