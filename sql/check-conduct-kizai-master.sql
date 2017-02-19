select "CHECKING ORPHAN VISIT_CONDUCT_ID" as ``;
select k.id, k.visit_conduct_id, c.id from visit_conduct_kizai k left outer join visit_conduct c
	on k.visit_conduct_id = c.id 
	where c.id is null;

select k.id, k.kizaicode, m.kizaicode from ((visit_conduct_kizai k inner join visit_conduct c on k.visit_conduct_id = c.id )
	inner join visit v on c.visit_id = v.visit_id)
	left outer join tokuteikizai_master_arch m 
	on k.kizaicode = m.kizaicode 
	and m.valid_from <= date(v.v_datetime) 
	and (m.valid_upto = '0000-00-00' or m.valid_upto >= date(v.v_datetime))
	where m.kizaicode is null
	;

select k.id, count(*) as c from visit_conduct_kizai k, visit_conduct c, visit v, tokuteikizai_master_arch m
	where k.visit_conduct_id = c.id
	and c.visit_id = v.visit_id and k.kizaicode = m.kizaicode
	and m.valid_from <= date(v.v_datetime) 
	and (m.valid_upto = '0000-00-00' or m.valid_upto >= date(v.v_datetime))
	group by k.id, k.kizaicode
	having c != 1
	;