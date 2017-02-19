update visit_shinryou, visit v, shinryoukoui_master_arch m
	set visit_shinryou.master_valid_from = m.valid_from 
	where visit_shinryou.visit_id = v.visit_id
	and visit_shinryou.shinryoucode = m.shinryoucode 
	and m.valid_from <= date(v.v_datetime)
	and (m.valid_upto = '0000-00-00' or m.valid_upto >= date(v.v_datetime));