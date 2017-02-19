select "CHECKING SHAHOKOKUHO..." as ``;
select shahokokuho_id, patient_id, valid_from, valid_upto from hoken_shahokokuho where dayname(valid_from) is null 
	or (dayname(valid_upto) is null and valid_upto != '0000-00-00');

select "CHECKING ROUJIN..." as ``;
select roujin_id, patient_id, valid_from, valid_upto from hoken_roujin where dayname(valid_from) is null 
	or (dayname(valid_upto) is null and valid_upto != '0000-00-00');

select "CHECKING KOUKIKOUREI..." as ``;
select koukikourei_id, patient_id, valid_from, valid_upto from hoken_koukikourei where dayname(valid_from) is null 
	or (dayname(valid_upto) is null and valid_upto != '0000-00-00');

select "CHECKING KOUHI..." as ``;
select kouhi_id, patient_id, valid_from, valid_upto from kouhi where dayname(valid_from) is null 
	or (dayname(valid_upto) is null and valid_upto != '0000-00-00');

select "CHECKING PATIENT..." as ``;
select patient_id, birth_day from patient where dayname(birth_day) is null and birth_day != '0000-00-00';

select "CHECKING IYAKUHIN_MASTER..." as ``;
select iyakuhincode, valid_from, valid_upto from iyakuhin_master_arch where dayname(valid_from) is null 
	or (dayname(valid_upto) is null and valid_upto != '0000-00-00');

select "CHECKING SHINRYOUKOUI_MASTER..." as ``;
select shinryoucode, valid_from, valid_upto from shinryoukoui_master_arch where dayname(valid_from) is null 
	or (dayname(valid_upto) is null and valid_upto != '0000-00-00');

select "CHECKING KIZAI_MASTER..." as ``;
select kizaicode, valid_from, valid_upto from tokuteikizai_master_arch where dayname(valid_from) is null 
	or (dayname(valid_upto) is null and valid_upto != '0000-00-00');

select "CHECKING DISEASE..." as ``;
select disease_id, start_date, end_date from disease where dayname(start_date) is null 
	or (dayname(end_date) is null and end_date != '0000-00-00');

select "CHECKING VISIT..." as ``;
select visit_id, v_datetime from visit where dayname(v_datetime) is null;



