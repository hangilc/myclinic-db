select k.id, count(*) as c from visit_conduct_kizai k, visit_conduct c, visit v, tokuteikizai_master_arch m
	where k.visit_conduct_id = c.id
	and c.visit_id = v.visit_id and k.kizaicode = m.kizaicode
	and m.valid_from <= date(v.v_datetime) 
	and (m.valid_upto = '0000-00-00' or m.valid_upto >= date(v.v_datetime))
	group by k.id, k.kizaicode
	having c > 1
	;