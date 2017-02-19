update visit_conduct_shinryou s, visit_conduct c, visit v, shinryoukoui_master_arch m
	set s.master_valid_from = m.valid_from 
	where c.visit_id = v.visit_id
	and s.visit_conduct_id = c.id
	and s.shinryoucode = m.shinryoucode 
	and m.valid_from <= date(v.v_datetime)
	and (m.valid_upto = '0000-00-00' or m.valid_upto >= date(v.v_datetime));