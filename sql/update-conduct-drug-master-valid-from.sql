update visit_conduct_drug d, visit_conduct c, visit v, iyakuhin_master_arch m
	set d.master_valid_from = m.valid_from 
	where c.visit_id = v.visit_id
	and d.visit_conduct_id = c.id
	and d.iyakuhincode = m.iyakuhincode 
	and m.valid_from <= date(v.v_datetime)
	and (m.valid_upto = '0000-00-00' or m.valid_upto >= date(v.v_datetime));