select s.shinryou_id, count(*) as c from visit_shinryou s, visit v, shinryoukoui_master_arch m
	where s.visit_id = v.visit_id and s.shinryoucode = m.shinryoucode
	and m.valid_from <= date(v.v_datetime) 
	and (m.valid_upto = '0000-00-00' or m.valid_upto >= date(v.v_datetime))
	group by s.shinryou_id, s.shinryoucode
	having c > 1
	;